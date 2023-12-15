"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.CodeBlockTabs = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@chakra-ui/react");
var BsChevronLeft_1 = require("@react-icons/all-files/bs/BsChevronLeft");
var BsChevronRight_1 = require("@react-icons/all-files/bs/BsChevronRight");
var CodeBlock_1 = require("./CodeBlock");
var tinycolor_1 = require("@ctrl/tinycolor");
var language_util_1 = require("./language-util");
var prism_1 = require("./prism");
function getTabButtonProps(loc, visible, gradientColor) {
    var endColor = gradientColor.clone().setAlpha(0);
    return {
        pos: 'absolute',
        left: loc === 'LEFT' ? '-1px' : undefined,
        right: loc === 'RIGHT' ? '-1px' : undefined,
        top: '0',
        bottom: '0',
        alignItems: 'center',
        justifyContent: loc === 'LEFT' ? 'flex-start' : 'flex-end',
        zIndex: '99',
        width: '8',
        background: "linear-gradient(".concat([
            loc === 'LEFT' ? '90deg' : '270deg',
            "".concat(gradientColor.toRgbString(), " 50%"),
            endColor.toRgbString()
        ], ")"),
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'all 250ms ease-in-out',
        cursor: 'pointer'
    };
}
var CodeBlockTabs = function (_a) {
    var languages = _a.languages, activeLanguage = _a.activeLanguage, setLanguage = _a.setLanguage;
    // Track inner (infinite width) and outer (container width) boxes using refs
    var outerRef = (0, react_1.useRef)(null);
    var innerRef = (0, react_1.useRef)(null);
    // Track the scroll position, represented as [0,1] inclusive
    var _b = (0, react_1.useState)(0), scrollPosition = _b[0], setScrollPosition = _b[1];
    // Track tabs scroll position to determine if arrows are necessary
    (0, react_1.useEffect)(function () {
        if (!outerRef.current)
            return;
        var el = outerRef.current;
        var onScroll = function () {
            var maxScroll = el.scrollWidth - el.clientWidth;
            setScrollPosition(el.scrollLeft / maxScroll);
        };
        outerRef.current.addEventListener('scroll', onScroll);
        return function () {
            el.removeEventListener('scroll', onScroll);
        };
    }, [outerRef]);
    // Allow for arrow presses to induce a short scroll left or right
    var bumpScroll = function (distance) { return function () {
        var _a;
        if (!outerRef)
            return;
        (_a = outerRef.current) === null || _a === void 0 ? void 0 : _a.scrollBy({
            left: distance,
            behavior: 'smooth'
        });
    }; };
    var theme = (0, prism_1.usePrismTheme)();
    var bgColor = (0, react_2.useToken)('colors', 'gray.800');
    var gradientColor = (0, react_2.useColorModeValue)(new tinycolor_1.TinyColor('white'), new tinycolor_1.TinyColor(bgColor));
    // Determine which arrows (if any) need to be shown
    var showArrows = Boolean(innerRef.current &&
        outerRef.current &&
        innerRef.current.clientWidth > outerRef.current.clientWidth);
    // Determine if the left or right arrows should be shown based on overall
    // visibility, and the scroll position
    var showLeftArrow = showArrows && scrollPosition > 0;
    var showRightArrow = showArrows && scrollPosition < 1;
    return (react_1["default"].createElement(react_2.Box, { pos: "relative", pt: "1", zIndex: "0" },
        react_1["default"].createElement(react_2.Flex, __assign({}, getTabButtonProps('LEFT', showLeftArrow, gradientColor), { onClick: bumpScroll(-120) }),
            react_1["default"].createElement(BsChevronLeft_1.BsChevronLeft, null)),
        react_1["default"].createElement(react_2.Box, { overflowX: "auto", pos: "relative", css: {
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none'
            }, ref: outerRef },
            react_1["default"].createElement(react_2.ButtonGroup, { size: "xs", role: "tablist", ref: innerRef, display: "flex", flexDirection: "row", w: "max-content" }, languages.map(function (language) { return (react_1["default"].createElement(react_2.Button, { leftIcon: (0, language_util_1.getIconComponent)(language), key: language, onClick: function () {
                    var _a;
                    if (setLanguage) {
                        setLanguage(language);
                    }
                    (_a = window.gtag) === null || _a === void 0 ? void 0 : _a.call(window, 'event', 'Change language', {
                        event_category: CodeBlock_1.GA_EVENT_CATEGORY_CODE_BLOCK,
                        event_label: language
                    });
                }, roundedBottom: "none", bg: language !== activeLanguage
                    ? theme.plain.backgroundColor
                    : undefined, role: "tab", "aria-selected": "true", mt: "1", flexShrink: 0 }, language)); }))),
        react_1["default"].createElement(react_2.Flex, __assign({}, getTabButtonProps('RIGHT', showRightArrow, gradientColor), { onClick: bumpScroll(120) }),
            react_1["default"].createElement(BsChevronRight_1.BsChevronRight, null))));
};
exports.CodeBlockTabs = CodeBlockTabs;
