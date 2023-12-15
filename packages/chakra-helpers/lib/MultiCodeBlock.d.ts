import React, { ReactNode } from 'react';
export declare const MultiCodeBlockContext: React.Context<{
    language: string | null;
    setLanguage: React.Dispatch<string>;
}>;
declare type MultiCodeBlockProps = {
    showTabs?: boolean;
    children: ReactNode;
};
export declare const MultiCodeBlock: ({ showTabs, children }: MultiCodeBlockProps) => JSX.Element;
export {};
