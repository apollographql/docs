"use strict";
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
exports.__esModule = true;
exports.MultiCodeBlock = exports.MultiCodeBlockContext = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@chakra-ui/react");
var CodeBlockTabs_1 = require("./CodeBlockTabs");
var language_util_1 = require("./language-util");
exports.MultiCodeBlockContext = (0, react_1.createContext)(null);
var MultiCodeBlock = function (_a) {
    var _b = _a.showTabs, showTabs = _b === void 0 ? true : _b, children = _a.children;
    var codeBlocks = react_1["default"].Children.toArray(children).reduce(function (acc, child) {
        var _a;
        if (!(0, react_1.isValidElement)(child)) {
            return acc;
        }
        return Object.assign(acc, (_a = {},
            _a[(0, language_util_1.getNormalizedLanguage)(child.props.children.props.className)] = child,
            _a));
    }, {});
    var codeBlockContext = (0, react_1.useContext)(exports.MultiCodeBlockContext);
    var languages = Object.keys(codeBlocks);
    var defaultLanguage = languages[0];
    var _c = (0, react_1.useState)(languages[0]), localLanguage = _c[0], setLocalLanguage = _c[1];
    var language = codeBlockContext ? codeBlockContext.language : localLanguage;
    var setLanguage = codeBlockContext
        ? codeBlockContext.setLanguage
        : setLocalLanguage;
    var renderedLanguage = languages.includes(language)
        ? language
        : defaultLanguage;
    return (react_1["default"].createElement(react_2.Flex, { flexDir: "column", pt: "6" },
        showTabs && (react_1["default"].createElement(CodeBlockTabs_1.CodeBlockTabs, { languages: languages, activeLanguage: renderedLanguage, setLanguage: setLanguage })),
        languages.map(function (language) { return (react_1["default"].createElement(react_2.Box, { key: language, role: "tabpanel", tabIndex: 0, display: language === renderedLanguage ? 'block' : 'none' }, react_1["default"].cloneElement(codeBlocks[language], {
            isPartOfMultiCode: true
        }))); })));
};
exports.MultiCodeBlock = MultiCodeBlock;
