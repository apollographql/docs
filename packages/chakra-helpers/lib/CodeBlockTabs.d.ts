/// <reference types="react" />
interface CodeBlockTabsProps {
    languages: string[];
    activeLanguage: string;
    setLanguage?: (language: string) => void;
}
export declare const CodeBlockTabs: ({ languages, activeLanguage, setLanguage }: CodeBlockTabsProps) => JSX.Element;
export {};
