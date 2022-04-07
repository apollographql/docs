import React, {
  ReactChild,
  ReactNode,
  createContext,
  isValidElement,
  useContext
} from 'react';
import {Button, Menu, MenuButton, MenuItem, MenuList} from '@chakra-ui/react';
import {CodeBlockContext, GA_EVENT_CATEGORY_CODE_BLOCK} from './CodeBlock';
import {FiChevronDown} from '@react-icons/all-files/fi/FiChevronDown';

export const MultiCodeBlockContext = createContext(null);

function getLanguage(language: string): string {
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

type MultiCodeBlockProps = {
  children: ReactNode;
};

export const MultiCodeBlock = ({
  children
}: MultiCodeBlockProps): JSX.Element => {
  const codeBlocks = React.Children.toArray(children).reduce(
    (acc: Record<string, ReactChild>, child) =>
      isValidElement(child)
        ? {
            ...acc,
            [getLanguage(child.props.children.props.className)]: child
          }
        : acc,
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
                      event_category: GA_EVENT_CATEGORY_CODE_BLOCK,
                      event_label: language
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
};
