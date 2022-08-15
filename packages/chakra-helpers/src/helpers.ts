import React, {Context, createContext, useContext} from 'react';
import {BiText} from '@react-icons/all-files/bi/BiText';
import {ColorHues} from '@chakra-ui/react';
import {ColorPalette, MonochromePalette} from '@apollo/space-kit/colors';
import {SiGnubash} from '@react-icons/all-files/si/SiGnubash';
import {SiGraphql} from '@react-icons/all-files/si/SiGraphql';
import {SiGroovy} from '@react-icons/all-files/si/SiGroovy';
import {SiJava} from '@react-icons/all-files/si/SiJava';
import {SiJavascript} from '@react-icons/all-files/si/SiJavascript';
import {SiJson} from '@react-icons/all-files/si/SiJson';
import {SiKotlin} from '@react-icons/all-files/si/SiKotlin';
import {SiRuby} from '@react-icons/all-files/si/SiRuby';
import {SiRust} from '@react-icons/all-files/si/SiRust';
import {SiSwift} from '@react-icons/all-files/si/SiSwift';
import {SiTypescript} from '@react-icons/all-files/si/SiTypescript';
import {TiDocumentText} from '@react-icons/all-files/ti/TiDocumentText';

import {mix} from 'polished';
import type {IconType} from '@react-icons/all-files/lib';

const body = "'Source Sans Pro', sans-serif";
export const fonts = {
  body,
  heading: body,
  mono: "'Source Code Pro', monospace"
};

export const components = {
  Heading: {
    baseStyle: {
      fontWeight: 'semibold'
    }
  }
};

export const createGrayPalette = (
  low: MonochromePalette,
  mid: MonochromePalette,
  high: ColorPalette
): ColorHues => ({
  50: low.light,
  100: low.base,
  200: low.dark,
  300: low.darker,
  400: mid.light,
  500: mid.dark,
  600: high.dark,
  700: mix(0.5, high.dark, high.darker),
  800: high.darker,
  900: high.darkest
});

// since space kit palettes only contain 7 keys (lightest not included here)
// we need to mix colors together to fill the gaps and create a complete
// chakra color palette
export const createColorPalette = (color: ColorPalette): ColorHues => ({
  50: color.lightest,
  100: color.lighter,
  200: color.light,
  300: mix(0.5, color.light, color.base),
  400: color.base,
  500: color.dark,
  600: mix(0.5, color.dark, color.darker),
  700: color.darker,
  800: mix(0.5, color.darker, color.darkest),
  900: color.darkest
});

export function getNormalizedLanguage(language?: string): string {
  const classless =
    language
      ?.replace(/language-/g, '')
      .toLocaleLowerCase()
      .replace(/:.*/g, '') ?? '';
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
      return classless[0].toLocaleUpperCase() + classless.slice(1);
    default:
      return classless;
  }
}

export function getIconComponentType(language: string): IconType | undefined {
  const normalizedLang = getNormalizedLanguage(language);
  const componentMap: Record<string, IconType> = {
    JavaScript: SiJavascript,
    TypeScript: SiTypescript,
    JSON: SiJson,
    GraphQL: SiGraphql,
    Text: BiText,
    Bash: SiGnubash,
    Groovy: SiGroovy,
    Java: SiJava,
    Kotlin: SiKotlin,
    Ruby: SiRuby,
    Rust: SiRust,
    Swift: SiSwift,
    YAML: TiDocumentText
  };
  const component = componentMap[normalizedLang];
  return component;
}

export function getIconComponent(language: string): React.ReactElement {
  const normalizedLang = getNormalizedLanguage(language);
  const iconType = getIconComponentType(normalizedLang);
  if (!iconType) {
    return undefined;
  }
  return React.createElement(iconType);
}
