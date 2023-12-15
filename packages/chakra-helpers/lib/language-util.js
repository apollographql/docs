"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getIconComponent = exports.getIconComponentType = exports.getNormalizedLanguage = void 0;
var react_1 = __importDefault(require("react"));
var BiText_1 = require("@react-icons/all-files/bi/BiText");
var SiGnubash_1 = require("@react-icons/all-files/si/SiGnubash");
var SiGraphql_1 = require("@react-icons/all-files/si/SiGraphql");
var SiGroovy_1 = require("@react-icons/all-files/si/SiGroovy");
var SiJava_1 = require("@react-icons/all-files/si/SiJava");
var SiJavascript_1 = require("@react-icons/all-files/si/SiJavascript");
var SiJson_1 = require("@react-icons/all-files/si/SiJson");
var SiKotlin_1 = require("@react-icons/all-files/si/SiKotlin");
var SiRuby_1 = require("@react-icons/all-files/si/SiRuby");
var SiRust_1 = require("@react-icons/all-files/si/SiRust");
var SiSwift_1 = require("@react-icons/all-files/si/SiSwift");
var SiTypescript_1 = require("@react-icons/all-files/si/SiTypescript");
var TiDocumentText_1 = require("@react-icons/all-files/ti/TiDocumentText");
function getNormalizedLanguage(language) {
    var _a;
    var classless = (_a = language === null || language === void 0 ? void 0 : language.replace(/language-/g, '').toLocaleLowerCase().replace(/:.*/g, '')) !== null && _a !== void 0 ? _a : '';
    switch (classless) {
        case 'js':
        case 'jsx':
        case 'javascript':
            return 'JavaScript';
        case 'ts':
        case 'tsx':
        case 'typescript':
            return 'TypeScript';
        case 'graphql':
            return 'GraphQL';
        case 'json':
            return 'JSON';
        case 'yaml':
            return 'YAML';
        case 'text':
        case 'swift':
        case 'bash':
        case 'groovy':
        case 'java':
        case 'kotlin':
        case 'rust':
        case 'ruby':
        case 'rhai':
            return classless[0].toLocaleUpperCase() + classless.slice(1);
        default:
            return classless;
    }
}
exports.getNormalizedLanguage = getNormalizedLanguage;
function getIconComponentType(language) {
    var normalizedLang = getNormalizedLanguage(language);
    var componentMap = {
        JavaScript: SiJavascript_1.SiJavascript,
        TypeScript: SiTypescript_1.SiTypescript,
        JSON: SiJson_1.SiJson,
        GraphQL: SiGraphql_1.SiGraphql,
        Text: BiText_1.BiText,
        Bash: SiGnubash_1.SiGnubash,
        Groovy: SiGroovy_1.SiGroovy,
        Java: SiJava_1.SiJava,
        Kotlin: SiKotlin_1.SiKotlin,
        Ruby: SiRuby_1.SiRuby,
        Rust: SiRust_1.SiRust,
        Swift: SiSwift_1.SiSwift,
        YAML: TiDocumentText_1.TiDocumentText
    };
    var component = componentMap[normalizedLang];
    return component;
}
exports.getIconComponentType = getIconComponentType;
function getIconComponent(language) {
    var normalizedLang = getNormalizedLanguage(language);
    var iconType = getIconComponentType(normalizedLang);
    if (!iconType) {
        return undefined;
    }
    return react_1["default"].createElement(iconType);
}
exports.getIconComponent = getIconComponent;
