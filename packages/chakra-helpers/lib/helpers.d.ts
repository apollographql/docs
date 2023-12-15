import { ColorHues } from '@chakra-ui/react';
import { ColorPalette, MonochromePalette } from '@apollo/space-kit/colors';
export declare const fonts: {
    body: string;
    heading: string;
    mono: string;
};
export declare const components: {
    Heading: {
        baseStyle: {
            fontWeight: string;
        };
    };
};
export declare const createGrayPalette: (low: MonochromePalette, mid: MonochromePalette, high: ColorPalette) => ColorHues;
export declare const createColorPalette: (color: ColorPalette) => ColorHues;
