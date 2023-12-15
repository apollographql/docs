export interface Link {
    text: string;
    href: string;
    internal?: boolean;
}
export interface Category {
    title: string;
    links: Link[];
}
export declare const companyCategory: Category;
export declare const productCategory: Category;
export declare const communityCategory: Category;
export declare const whyApolloCategory: Category;
export declare const helpCategory: Category;
export declare const defaultConfig: Category[];
