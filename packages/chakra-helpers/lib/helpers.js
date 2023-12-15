"use strict";
exports.__esModule = true;
exports.createColorPalette = exports.createGrayPalette = exports.components = exports.fonts = void 0;
var polished_1 = require("polished");
var body = "'Source Sans Pro', sans-serif";
exports.fonts = {
    body: body,
    heading: body,
    mono: "'Source Code Pro', monospace"
};
exports.components = {
    Heading: {
        baseStyle: {
            fontWeight: 'semibold'
        }
    }
};
var createGrayPalette = function (low, mid, high) { return ({
    50: low.light,
    100: low.base,
    200: low.dark,
    300: low.darker,
    400: mid.light,
    500: mid.dark,
    600: high.dark,
    700: (0, polished_1.mix)(0.5, high.dark, high.darker),
    800: high.darker,
    900: high.darkest
}); };
exports.createGrayPalette = createGrayPalette;
// since space kit palettes only contain 7 keys (lightest not included here)
// we need to mix colors together to fill the gaps and create a complete
// chakra color palette
var createColorPalette = function (color) { return ({
    50: color.lightest,
    100: color.lighter,
    200: color.light,
    300: (0, polished_1.mix)(0.5, color.light, color.base),
    400: color.base,
    500: color.dark,
    600: (0, polished_1.mix)(0.5, color.dark, color.darker),
    700: color.darker,
    800: (0, polished_1.mix)(0.5, color.darker, color.darkest),
    900: color.darkest
}); };
exports.createColorPalette = createColorPalette;
