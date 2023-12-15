/// <reference types="react" />
import PropTypes from 'prop-types';
declare type EmbeddableExplorerProps = {
    graphRef?: string;
    endpointUrl?: string;
    document?: string;
    height?: number;
    showHeadersAndEnvVars?: boolean;
    docsPanelState?: 'open' | 'closed';
};
export declare const EmbeddableExplorer: {
    ({ graphRef, endpointUrl, document, height, showHeadersAndEnvVars, docsPanelState }: EmbeddableExplorerProps): JSX.Element;
    propTypes: {
        graphRef: PropTypes.Requireable<string>;
        endpointUrl: PropTypes.Requireable<string>;
        document: PropTypes.Requireable<string>;
        height: PropTypes.Requireable<number>;
        showHeadersAndEnvVars: PropTypes.Requireable<boolean>;
        docsPanelState: PropTypes.Requireable<string>;
    };
};
export {};
