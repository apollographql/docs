// @ts-check

/**
 * @typedef {{
 *  type: string,
 *  start: number,
 *  end: number,
 *  [other: string]: any
 * }} AstNode
 */

/**
 * @typedef {(code: string, index: number) => AstNode | null | void} ParserFn
 */

/**
 * @param {string} code
 * @param {number} index
 * @param {object} left
 * @returns {AstNode}
 */
function lookahead(code, index, left) {
  while (code[index] === ' ') index++;
  /** @type {AstNode} */
  let node = left;
  let found;

  if (code[index] === '[' && code[index + 1] === ']') {
    node = {
      type: 'TypeExpression',
      name: 'Array',
      generics: [left],
      start: index,
      end: index + 2
    };
  } else if (code[index] === '|') {
    const right = parseExpression(code, index + 1);
    node = {
      type: 'Union',
      left,
      right,
      start: left.start,
      end: right.end
    };
  } else if (code[index] === '&') {
    const right = parseExpression(code, index + 1);
    node = {
      type: 'Intersection',
      left,
      right,
      start: left.start,
      end: right.end
    };
  } else if ((found = peekFixedString(code, index, 'extends'))) {
    const constraint = parseExpression(code, found);
    const question = constraint && peekFixedString(code, constraint.end, '?');
    const trueCase = question && parseExpression(code, question);
    const colon = trueCase && peekFixedString(code, trueCase.end, ':');
    const falseCase = colon && parseExpression(code, colon);

    if (falseCase) {
      node = {
        type: 'Conditional',
        expression: left,
        extends: constraint,
        trueCase,
        falseCase,
        start: left.start,
        end: falseCase.end
      };
    }
  }

  if (node !== left) return lookahead(code, node.end, node);
  return node;
}

/**
 * @param {string} code
 * @param {number} index
 * @returns {AstNode}
 */
function parseExpression(code, index) {
  while (code[index] === ' ') index++;
  let node =
    parseArrowFunction(code, index) ||
    parseParenthesis(code, index) ||
    parseInterfaceDefinition(code, index) ||
    parseKeyword(code, index) ||
    parsePropertyAccess(code, index) ||
    parseTypeExpression(code, index) ||
    parseNumber(code, index) ||
    parseString(code, index) ||
    parseObject(code, index) ||
    parseTuple(code, index);

  if (!node)
    throw new Error(
      'could not parse expression at `' + code.slice(index) + '`'
    );

  node = {unparsed: code.slice(node.start, node.end), ...node};

  node = lookahead(code, node.end, node);

  node = {unparsed: code.slice(node.start, node.end), ...node};
  return node;
}

const parseKeyword = getRegexParser(
  /^(true|false|void|undefined|object|string|number|boolean)/,
  'Keyword'
);

const parseNumber = getRegexParser(/^\d+(\.\d+)?/, 'Number');

const parseIdentifier = getRegexParser(/^[a-zA-Z][$\w]*/, 'Identifier');

/** @type {ParserFn} */
function parseString(code, index) {
  const delim = code[index];
  if (delim === '"' || delim === "'") {
    const skipped = skipBetweenDelimiters(code, index);
    return skipped && {type: 'String', start: index, end: skipped.end};
  }
}

/** @type {ParserFn} */
function parseObject(code, index) {
  if (code[index] === '{') {
    const skipped = skipBetweenDelimiters(code, index);
    return skipped && {type: 'Object', start: index, end: skipped.end};
  }
}

/** @type {ParserFn} */
function parseTuple(code, index) {
  if (code[index] === '[') {
    const skipped = skipBetweenDelimiters(code, index);
    return skipped && {type: 'Tuple', start: index, end: skipped.end};
  }
}

/** @type {ParserFn} */
function parseTypeExpression(code, index) {
  const identifier = parseIdentifier(code, index);
  if (!identifier) return null;
  if (code[identifier.end] !== '<')
    return {
      type: 'TypeExpression',
      name: identifier,
      start: index,
      end: identifier.end
    };

  const generics = [];
  for (let i = identifier.end; i < code.length; i++) {
    switch (code[i]) {
      case '<':
      case ',': {
        const generic = parseExpression(code, i + 1);
        generics.push(generic);
        i = generic.end - 1;
        const extendsEnd = peekFixedString(code, i + 1, 'extends');
        if (extendsEnd) {
          const constraint = parseExpression(code, extendsEnd);
          i = constraint.end - 1;
        }
        const defaultEnd = peekFixedString(code, i + 1, '=');
        if (defaultEnd) {
          const defaultType = parseExpression(code, defaultEnd);
          i = defaultType.end - 1;
        }
        break;
      }
      case '>':
        return {
          type: 'TypeExpression',
          name: identifier,
          generics,
          start: index,
          end: i + 1
        };
      case ' ':
        break;
      default:
        return null;
    }
  }
}

/** @type {ParserFn} */
function parseArrowFunction(code, index) {
  const parameters =
    code[index] === '('
      ? skipBetweenDelimiters(code, index)
      : parseIdentifier(code, index);
  const arrowEnd = parameters && peekFixedString(code, parameters.end, '=>');
  const returnValue = arrowEnd && parseExpression(code, arrowEnd);
  return (
    returnValue && {
      type: 'ArrowFunction',
      parameters,
      returnType: returnValue,
      start: index,
      end: returnValue.end
    }
  );
}

/** @type {ParserFn} */
function parseParenthesis(code, index) {
  if (code[index] === '(') {
    const expression = parseExpression(code, index + 1);
    const finalIndex = peekFixedString(code, expression.end, ')');
    if (finalIndex) return expression;
  }
}

/** @type {ParserFn} */
function parsePropertyAccess(code, index) {
  const parent = parseIdentifier(code, index);
  const dotAccessStart = parent && peekFixedString(code, parent.end, '.');
  if (dotAccessStart) {
    const property = parseIdentifier(code, dotAccessStart);
    return (
      property && {
        type: 'PropertyAccess',
        parent,
        property,
        start: index,
        end: property.end
      }
    );
  }
  const propertyAccessStart = parent && peekFixedString(code, parent.end, '[');
  if (propertyAccessStart) {
    if (peekFixedString(code, propertyAccessStart, ']')) {
      // array expression not handled here
      return null;
    }
    const property = parseExpression(code, propertyAccessStart);
    const propertyAccessEnd = peekFixedString(code, property.end, ']');
    return (
      propertyAccessEnd && {
        type: 'PropertyAccess',
        parent,
        property,
        start: index,
        end: propertyAccessEnd
      }
    );
  }
}

/** @type {ParserFn} */
function parseInterfaceDefinition(code, index) {
  index = peekFixedString(code, index, 'export') || index;
  const typeEnd = peekFixedString(code, index, 'interface');
  const signature = typeEnd && parseExpression(code, typeEnd);

  return (
    signature && {
      type: 'InterfaceDeclaration',
      signature,
      start: index,
      end: signature.end
    }
  );
}

function getRegexParser(regex, type, valueFromMatch = match => match[0]) {
  /** @type {ParserFn} */
  return function regexParser(code, index) {
    while (code[index] === ' ') index++;
    const match = code.slice(index).match(regex);
    return (
      match && {
        type,
        value: valueFromMatch(match),
        start: index,
        end: index + match[0].length
      }
    );
  };
}

const validDelimiters = ['"', "'", '`', '{', '[', '('];
const oppositeDelimiters = ['"', "'", '`', '}', ']', ')'];
/** @type {ParserFn} */
function skipBetweenDelimiters(code, index) {
  const delim = code[index];
  const idx = validDelimiters.indexOf(delim);
  if (idx === -1) return null;
  const lookFor = oppositeDelimiters[idx];

  for (let i = index + 1; i < code.length; i++) {
    const char = code[i];
    if (char === '\\') {
      i++;
    } else if (char === lookFor) {
      return {type: 'Skipped', start: index, end: i + 1};
    } else if (
      validDelimiters.includes(char) &&
      delim !== '"' &&
      delim !== "'" &&
      delim !== '`'
    ) {
      const child = /** @type {AstNode} */ (skipBetweenDelimiters(code, i));
      i = child.end - 1;
    }
  }
}

function peekFixedString(code, index, string) {
  if (string === '') throw new Error('string must not be empty');
  while (code[index] === ' ') index++;
  if (code.slice(index, index + string.length) === string)
    return index + string.length;
}

function parseAst(code) {
  try {
    return parseExpression(code, 0);
  } catch (e) {
    /**
     * This might leave single parts of the API documentation without the right "primary reference type",
     * but it won't make the docs unusable in any way, so we only log it and don't fail.
     */
    console.warn(
      'Encountered error while parsing expression %s. ',
      code,
      ':',
      e
    );
    return null;
  }
}

const skipToGeneric = {
  Omit: 0,
  Partial: 0,
  Promise: 0,
  NoInfer: 0,
  Array: 0,
  Observable: 0,
  Map: 1
};
/**
 *
 * @param {object} ast
 * @returns object | null
 */
function skipToPrimaryType(ast) {
  if (!ast) return null;
  if (ast.type === 'TypeExpression' && ast.name.value in skipToGeneric) {
    return skipToPrimaryType(ast.generics[skipToGeneric[ast.name.value]]);
  }
  if (ast.type === 'Union' || ast.type === 'Intersection') {
    if (ast.left.type === 'Keyword') return skipToPrimaryType(ast.right);
    if (ast.right.type === 'Keyword') return skipToPrimaryType(ast.left);
    return null;
  }
  if (ast.type === 'TypeDeclaration') return skipToPrimaryType(ast.expression);

  return ast.type === 'TypeExpression' ? ast : null;
}

module.exports = {
  parseAst,
  skipToPrimaryType
};
