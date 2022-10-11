import React from 'react';
import {BiText} from '@react-icons/all-files/bi/BiText';
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
import type {IconType} from '@react-icons/all-files/lib';

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
    case 'rhai':
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
