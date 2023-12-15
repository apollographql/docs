"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.EmbeddableExplorer = void 0;
var prop_types_1 = __importDefault(require("prop-types"));
var react_1 = __importDefault(require("react"));
var explorer_1 = require("@apollo/explorer");
var react_2 = require("@chakra-ui/react");
var outdent_1 = require("outdent");
var EmbeddableExplorer = function (_a) {
    var _b = _a.graphRef, graphRef = _b === void 0 ? 'Apollo-Fullstack-Demo-o3tsz8@current' : _b, _c = _a.endpointUrl, endpointUrl = _c === void 0 ? 'https://apollo-fullstack-tutorial.herokuapp.com/graphql' : _c, _d = _a.document, document = _d === void 0 ? (0, outdent_1.outdent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query GetLaunches {\n      launches {\n        launches {\n          id\n          site\n          rocket {\n            id\n            name\n          }\n        }\n      }\n    }\n  "], ["\n    query GetLaunches {\n      launches {\n        launches {\n          id\n          site\n          rocket {\n            id\n            name\n          }\n        }\n      }\n    }\n  "]))) : _d, _e = _a.height, height = _e === void 0 ? 450 : _e, _f = _a.showHeadersAndEnvVars, showHeadersAndEnvVars = _f === void 0 ? true : _f, _g = _a.docsPanelState, docsPanelState = _g === void 0 ? 'open' : _g;
    var colorMode = (0, react_2.useColorMode)().colorMode;
    return (react_1["default"].createElement(react_2.Box, { h: height, rounded: "md", sx: {
            '.embed': {
                boxSize: 'full'
            }
        } },
        react_1["default"].createElement(explorer_1.ApolloExplorerReact
        // give the component a key or else multiple explorers get rendered when
        // the color mode changes
        , { 
            // give the component a key or else multiple explorers get rendered when
            // the color mode changes
            key: colorMode, className: "embed", endpointUrl: endpointUrl, graphRef: graphRef, persistExplorerState: false, initialState: {
                document: document,
                displayOptions: {
                    theme: colorMode,
                    showHeadersAndEnvVars: showHeadersAndEnvVars,
                    docsPanelState: docsPanelState
                }
            } })));
};
exports.EmbeddableExplorer = EmbeddableExplorer;
exports.EmbeddableExplorer.propTypes = {
    graphRef: prop_types_1["default"].string,
    endpointUrl: prop_types_1["default"].string,
    document: prop_types_1["default"].string,
    height: prop_types_1["default"].number,
    showHeadersAndEnvVars: prop_types_1["default"].bool,
    docsPanelState: prop_types_1["default"].oneOf(['open', 'closed'])
};
var templateObject_1;
