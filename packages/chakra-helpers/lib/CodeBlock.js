"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.CodeBlock = exports.MarkdownCodeBlock = exports.LineNumbersContext = exports.CodeBlockContext = exports.GA_EVENT_CATEGORY_CODE_BLOCK = void 0;
var prism_react_renderer_1 = __importDefault(require("prism-react-renderer"));
var prismjs_1 = __importDefault(require("prismjs"));
var react_1 = __importStar(require("react"));
var fenceparser_1 = __importDefault(require("fenceparser"));
var parse_numeric_range_1 = __importDefault(require("parse-numeric-range"));
var react_2 = require("@chakra-ui/react");
var CodeBlockTabs_1 = require("./CodeBlockTabs");
var FiCheck_1 = require("@react-icons/all-files/fi/FiCheck");
var FiClipboard_1 = require("@react-icons/all-files/fi/FiClipboard");
var FiEyeOff_1 = require("@react-icons/all-files/fi/FiEyeOff");
var colors_1 = require("@apollo/space-kit/colors");
var language_util_1 = require("./language-util");
var prism_1 = require("./prism");
var CODE_BLOCK_SPACING = 4;
exports.GA_EVENT_CATEGORY_CODE_BLOCK = 'Code Block';
exports.CodeBlockContext = (0, react_1.createContext)(null);
exports.LineNumbersContext = (0, react_1.createContext)(true);
var isHighlightComment = function (token, comment) {
    if (comment === void 0) { comment = 'highlight-line'; }
    return (token.types.includes('comment') &&
        new RegExp("\\b".concat(comment, "\\s?")).test(token.content));
};
var isHighlightStart = function (line, comment) {
    if (comment === void 0) { comment = 'highlight-start'; }
    return line.some(function (token) { return isHighlightComment(token, comment); });
};
var isHighlightEnd = function (line) { return isHighlightStart(line, 'highlight-end'); };
var getCodeWithoutHighlightComments = function (code) {
    var highlightStarCommentRegex = /\/\* highlight-line \*\/\s?/gm;
    var highlightSlashCommentRegex = /\/\/ (highlight-line|highlight-start|highlight-end)$/gm;
    return code
        .replace(highlightStarCommentRegex, '')
        .replace(highlightSlashCommentRegex, '');
};
var MarkdownCodeBlock = function (_a) {
    var _b, _c;
    var children = _a.children, isPartOfMultiCode = _a.isPartOfMultiCode, props = __rest(_a, ["children", "isPartOfMultiCode"]);
    var defaultShowLineNumbers = (0, react_1.useContext)(exports.LineNumbersContext);
    var child = (Array.isArray(children) ? children : [children])[0];
    var _d = child.props, _e = _d.className, className = _e === void 0 ? 'language-text' : _e, innerChildren = _d.children, metastring = _d.metastring, dataMeta = _d["data-meta"], _f = _d.hidden // prioritize markdown hidden prop from child.props, then look at parent props. else default to false
    , hidden = _f === void 0 ? (_b = props.hidden) !== null && _b !== void 0 ? _b : false : _f // prioritize markdown hidden prop from child.props, then look at parent props. else default to false
    ;
    var meta = metastring || dataMeta;
    var _g = meta ? (0, fenceparser_1["default"])(meta) : {}, _h = _g.title, title = _h === void 0 ? null : _h, _j = _g.highlight, highlight = _j === void 0 ? null : _j, _k = _g.showLineNumbers, showLineNumbers = _k === void 0 ? defaultShowLineNumbers : _k, _l = _g.disableCopy // prioritize markdown disableCopy prop from meta, then look at parent props. else default to false
    , disableCopy = _l === void 0 ? (_c = props.disableCopy) !== null && _c !== void 0 ? _c : false : _l // prioritize markdown disableCopy prop from meta, then look at parent props. else default to false
    ;
    var linesToHighlight = highlight
        ? (0, parse_numeric_range_1["default"])(Object.keys(highlight).toString())
        : [];
    var code = (Array.isArray(innerChildren) ? innerChildren : [innerChildren])[0];
    return (react_1["default"].createElement(exports.CodeBlock, { code: code.trim(), language: className.replace(/^language-/, ''), title: title === null || title === void 0 ? void 0 : title.toString(), hidden: hidden, disableCopy: disableCopy === true, showLineNumbers: showLineNumbers === true, linesToHighlight: linesToHighlight, isPartOfMultiCode: isPartOfMultiCode }));
};
exports.MarkdownCodeBlock = MarkdownCodeBlock;
var CodeBlock = function (_a) {
    var code = _a.code, language = _a.language, title = _a.title, showLineNumbers = _a.showLineNumbers, _b = _a.linesToHighlight, linesToHighlight = _b === void 0 ? [] : _b, _c = _a.hidden, defaultHidden = _c === void 0 ? false : _c, _d = _a.disableCopy, disableCopy = _d === void 0 ? false : _d, _e = _a.isPartOfMultiCode, isPartOfMultiCode = _e === void 0 ? false : _e, _f = _a.disableTabs, disableTabs = _f === void 0 ? false : _f;
    var _g = (0, react_2.useClipboard)(getCodeWithoutHighlightComments(code)), onCopy = _g.onCopy, hasCopied = _g.hasCopied;
    var _h = (0, react_1.useState)(defaultHidden), hidden = _h[0], setHidden = _h[1];
    var theme = (0, prism_1.usePrismTheme)();
    var highlightColor = (0, react_2.useColorModeValue)('gray.100', 'gray.700');
    var lineNumberColor = (0, react_2.useColorModeValue)('gray.500', colors_1.colors.midnight.lighter);
    var blockLanguage = (0, language_util_1.getNormalizedLanguage)(language);
    return (react_1["default"].createElement(react_2.Box, null,
        !isPartOfMultiCode && !disableTabs && (react_1["default"].createElement(CodeBlockTabs_1.CodeBlockTabs, { languages: [blockLanguage], activeLanguage: blockLanguage })),
        react_1["default"].createElement(prism_react_renderer_1["default"]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        , { 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Prism: prismjs_1["default"], theme: theme, code: code, language: language }, function (_a) {
            var className = _a.className, style = _a.style, tokens = _a.tokens, getLineProps = _a.getLineProps, getTokenProps = _a.getTokenProps;
            // length of longest line number
            // ex. if there are 28 lines in the code block, lineNumberOffset = 2ch
            var lineNumberOffset = tokens.length.toString().length + 'ch';
            // create an array of lines highlighted by "highlight-start" and
            // "highlight-end" comments
            var highlightRange = [];
            var isHighlighting = false;
            var highlightOffset = 0;
            for (var i = 0; i < tokens.length; i++) {
                var line = tokens[i];
                if (isHighlightEnd(line)) {
                    // turn highlighting off
                    isHighlighting = false;
                    // account for the soon-to-be-missing start and end comments
                    highlightOffset += 2;
                }
                else if (isHighlightStart(line)) {
                    // start highlighting
                    isHighlighting = true;
                }
                else if (isHighlighting) {
                    // while highlighting, push the current index minus the offset into
                    // the array of highlighted lines
                    highlightRange.push(i - highlightOffset);
                }
            }
            return (react_1["default"].createElement(react_2.Box, { rounded: "md", roundedTop: "none", style: style, pos: "relative", borderWidth: "1px", lineHeight: "base" },
                react_1["default"].createElement(react_2.Box, { fontSize: "md", fontFamily: "mono" },
                    title && (react_1["default"].createElement(react_2.Box, { px: CODE_BLOCK_SPACING, py: "2", borderBottomWidth: "1px", borderTopRadius: "md" }, title)),
                    react_1["default"].createElement(react_2.Flex, { overflow: "auto", transition: "filter 200ms", css: hidden && {
                            filter: 'blur(8px)',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        } },
                        react_1["default"].createElement(react_2.chakra.pre, { d: "inline-block", minW: "full", className: className, py: CODE_BLOCK_SPACING, fontFamily: "inherit" }, tokens
                            .filter(function (line) { return !isHighlightStart(line) && !isHighlightEnd(line); })
                            .map(function (line, i) {
                            var shouldHighlight = 
                            // if the line number exists in the meta string or highlight comment ranges
                            linesToHighlight
                                .concat(highlightRange)
                                .includes(i + 1) ||
                                // or if the line has a "highlight-line" comment in it
                                line.some(function (token) { return isHighlightComment(token); });
                            return (react_1["default"].createElement(react_2.Flex, { key: i, px: CODE_BLOCK_SPACING, 
                                // for line highlighting to go all the way across code block
                                minW: "full", w: "fit-content", bg: shouldHighlight && highlightColor },
                                showLineNumbers && (react_1["default"].createElement(react_2.Box, { "aria-hidden": "true", userSelect: "none", 
                                    // line number alignment used in VS Code
                                    textAlign: "right", w: lineNumberOffset, mr: CODE_BLOCK_SPACING, color: lineNumberColor }, i + 1)),
                                react_1["default"].createElement(react_2.Box, __assign({}, getLineProps({
                                    line: line,
                                    key: i
                                })),
                                    react_1["default"].createElement(react_2.Box, null, line
                                        // filter out "highlight-line" comments
                                        .filter(function (token) { return !isHighlightComment(token); })
                                        .map(function (token, key) { return (react_1["default"].createElement("span", __assign({ key: key }, getTokenProps({ token: token, key: key })))); })))));
                        })))),
                react_1["default"].createElement(react_2.ButtonGroup, { size: "xs", pos: "absolute", top: "2", right: "2", transition: "opacity 200ms linear 200ms", css: hidden && {
                        opacity: 0,
                        transition: 'none'
                    } },
                    defaultHidden && (react_1["default"].createElement(react_2.IconButton, { "aria-label": "Hide code", icon: react_1["default"].createElement(FiEyeOff_1.FiEyeOff, null), onClick: function () { return setHidden(true); } })),
                    !disableCopy && (react_1["default"].createElement(react_2.Button, { leftIcon: hasCopied ? react_1["default"].createElement(FiCheck_1.FiCheck, null) : react_1["default"].createElement(FiClipboard_1.FiClipboard, null), onClick: function () {
                            var _a;
                            onCopy();
                            (_a = window.gtag) === null || _a === void 0 ? void 0 : _a.call(window, 'event', 'Copy', {
                                event_category: exports.GA_EVENT_CATEGORY_CODE_BLOCK
                            });
                        } }, hasCopied ? 'Copied!' : 'Copy'))),
                hidden && (react_1["default"].createElement(react_2.Button, { pos: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", onClick: function () { return setHidden(false); }, rounded: "full", colorScheme: "indigo" }, "Show code"))));
        })));
};
exports.CodeBlock = CodeBlock;
