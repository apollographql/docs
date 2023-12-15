import React from 'react';
import {Global} from '@emotion/react';

export function ResponsiveGridStyles() {
  return (
    <Global
      styles={{
        '.responsive-grid .row': {
          gridColumnStart: 1,
          gridColumnEnd: -1
        },
        '.responsive-grid details': {
          display: 'contents'
        },
        '.responsive-grid .first.cell': {
          gridColumnStart: 1
        },
        '.responsive-grid .cell': {
          gridColumnEnd: 'span 1'
        },
        '.responsive-grid details .cell': {
          gridColumnStart: 1,
          gridColumnEnd: -1
        },

        '.responsive-grid': {
          background: 'var(--chakra-colors-border)',
          gap: '1px'
        },
        '.responsive-grid > *, .responsive-grid > details > *': {
          background: 'var(--chakra-colors-bg)'
        },
        '.responsive-grid .cell, .responsive-grid .row': {
          padding: 'var(--chakra-space-4)'
        },
        '.responsive-grid details .first.cell + .cell': {
          marginTop: -1,
          paddingTop: 0
        },
        '.responsive-grid details h6': {
          display: 'inline'
        },
        '.responsive-grid .heading': {
          fontFamily: 'var(--chakra-fonts-heading)',
          fontWeight: 'var(--chakra-fontWeights-normal)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--chakra-letterSpacings-wider)',
          fontSize: 'var(--chakra-fontSizes-xs)'
        }
      }}
    />
  );
}
