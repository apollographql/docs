import { Language } from 'prism-react-renderer';
import React, { ReactNode } from 'react';
export declare const GA_EVENT_CATEGORY_CODE_BLOCK = "Code Block";
export declare const CodeBlockContext: React.Context<any>;
export declare const LineNumbersContext: React.Context<boolean>;
declare type MarkdownCodeBlockProps = {
    children: ReactNode;
    isPartOfMultiCode?: boolean;
    disableCopy?: boolean;
    hidden?: boolean;
};
export declare const MarkdownCodeBlock: ({ children, isPartOfMultiCode, ...props }: MarkdownCodeBlockProps) => JSX.Element;
export declare type CodeBlockProps = {
    language?: Language;
    title?: string;
    linesToHighlight?: number[];
    disableCopy?: boolean;
    showLineNumbers?: boolean;
    hidden?: boolean;
    code: string;
    isPartOfMultiCode?: boolean;
    disableTabs?: boolean;
};
export declare const CodeBlock: ({ code, language, title, showLineNumbers, linesToHighlight, hidden: defaultHidden, disableCopy, isPartOfMultiCode, disableTabs }: CodeBlockProps) => JSX.Element;
export {};
