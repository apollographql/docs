import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import {Button, Menu, MenuButton, MenuItem, MenuList} from '@chakra-ui/react';
import {CodeBlockContext, GA_EVENT_CATEGORY_CODE_BLOCK} from './CodeBlock';
import {FiChevronDown} from 'react-icons/fi';

export const MultiCodeBlockContext = createContext();

function getLanguage(language) {
  switch (language) {
    case 'language-js':
    case 'language-jsx':
    case 'language-javascript':
      return 'JavaScript';
    case 'language-ts':
    case 'language-tsx':
    case 'language-typescript':
      return 'TypeScript';
    default:
      return language;
  }
}

export default function MultiCodeBlock({children}) {
  const codeBlocks = React.Children.toArray(children).reduce(
    (acc, child) => ({
      ...acc,
      [getLanguage(child.props.children.props.className)]: child
    }),
    {}
  );

  const languages = Object.keys(codeBlocks);
  const defaultLanguage = languages[0];
  const {language, setLanguage} = useContext(MultiCodeBlockContext);
  const renderedLanguage = languages.includes(language)
    ? language
    : defaultLanguage;

  return (
    <div>
      <CodeBlockContext.Provider
        value={
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />}>
              {renderedLanguage}
            </MenuButton>
            <MenuList>
              {languages.map(language => (
                <MenuItem
                  key={language}
                  onClick={() => {
                    setLanguage(language);
                    window.gtag?.('event', 'Change language', {
                      category: GA_EVENT_CATEGORY_CODE_BLOCK,
                      label: language
                    });
                  }}
                >
                  {language}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        }
      >
        {codeBlocks[renderedLanguage]}
      </CodeBlockContext.Provider>
    </div>
  );
}

MultiCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
