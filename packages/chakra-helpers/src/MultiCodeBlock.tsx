import React, {
  ReactNode,
  createContext,
  isValidElement,
  useContext,
  useState
} from 'react';
import {Box, Flex} from '@chakra-ui/react';
import {CodeBlockProps} from './CodeBlock';
import {CodeBlockTabs} from './CodeBlockTabs';
import {getNormalizedLanguage} from './language-util';

export const MultiCodeBlockContext = createContext<{
  language: string | null;
  setLanguage: React.Dispatch<string>;
}>(null);

type MultiCodeBlockProps = {
  children: ReactNode;
};

export const MultiCodeBlock = ({
  children
}: MultiCodeBlockProps): JSX.Element => {
  const codeBlocks = React.Children.toArray(children).reduce<
    Record<string, React.ReactElement<CodeBlockProps>>
  >((acc, child) => {
    if (!isValidElement(child)) {
      return acc;
    }
    return Object.assign(acc, {
      [getNormalizedLanguage(child.props.children.props.className)]: child
    });
  }, {});

  const codeBlockContext = useContext(MultiCodeBlockContext);

  const languages = Object.keys(codeBlocks);
  const defaultLanguage = languages[0];
  const [localLanguage, setLocalLanguage] = useState(languages[0]);
  const language = codeBlockContext ? codeBlockContext.language : localLanguage;
  const setLanguage = codeBlockContext
    ? codeBlockContext.setLanguage
    : setLocalLanguage;
  const renderedLanguage = languages.includes(language)
    ? language
    : defaultLanguage;

  return (
    <Flex flexDir="column" pt="6">
      <CodeBlockTabs
        languages={languages}
        activeLanguage={renderedLanguage}
        setLanguage={setLanguage}
      />
      {languages.map(language => (
        <Box
          key={language}
          role="tabpanel"
          tabIndex={0}
          display={language === renderedLanguage ? 'block' : 'none'}
        >
          {React.cloneElement(codeBlocks[language], {
            isPartOfMultiCode: true
          })}
        </Box>
      ))}
    </Flex>
  );
};
