"use strict";
exports.__esModule = true;
exports.usePrismTheme = void 0;
var colors_1 = require("@apollo/space-kit/colors");
var react_1 = require("@chakra-ui/react");
var silver = colors_1.colors.silver, midnight = colors_1.colors.midnight, orange = colors_1.colors.orange, grey = colors_1.colors.grey, pink = colors_1.colors.pink, teal = colors_1.colors.teal, indigo = colors_1.colors.indigo, yellow = colors_1.colors.yellow;
function usePrismTheme() {
    var isDark = (0, react_1.useColorModeValue)(false, true);
    return {
        plain: {
            color: 'currentColor',
            backgroundColor: isDark ? midnight.darkest : silver.lighter
        },
        styles: [
            {
                types: ['important', 'bold'],
                style: {
                    fontWeight: 'bold'
                }
            },
            {
                types: ['italic'],
                style: {
                    fontStyle: 'italic'
                }
            },
            {
                types: ['entity'],
                style: {
                    cursor: 'help'
                }
            },
            {
                types: ['selector', 'attr-name', 'char', 'builtin', 'inserted'],
                style: {
                    color: teal[isDark ? 'light' : 'darker']
                }
            },
            {
                types: ['comment', 'prolog', 'doctype', 'cdata'],
                style: {
                    color: orange[isDark ? 'light' : 'darker'],
                    fontWeight: 'bold'
                }
            },
            {
                types: ['punctuation'],
                style: {
                    color: grey[isDark ? 'light' : 'dark']
                }
            },
            {
                types: [
                    'property',
                    'tag',
                    'boolean',
                    'number',
                    'constant',
                    'symbol',
                    'deleted',
                    'class-name',
                    'function'
                ],
                style: {
                    color: pink[isDark ? 'light' : 'dark']
                }
            },
            {
                types: ['atrule', 'attr-value', 'keyword'],
                style: {
                    color: 'inherit',
                    background: 'transparent'
                }
            },
            {
                types: ['atrule', 'attr-value', 'keyword'],
                style: {
                    color: indigo[isDark ? 'light' : 'dark']
                }
            },
            {
                types: ['regex', 'important', 'variable', 'description'],
                style: {
                    color: yellow[isDark ? 'light' : 'darker']
                }
            }
        ]
    };
}
exports.usePrismTheme = usePrismTheme;
