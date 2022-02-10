import {important} from 'polished';
import {useColorModeValue, useToken} from '@chakra-ui/react';
import {useMemo} from 'react';

export function useMermaidStyles() {
  const [primary, secondary, tertiary, fill, background] = useToken('colors', [
    useColorModeValue('indigo.500', 'indigo.300'),
    useColorModeValue('pink.700', 'pink.200'),
    useColorModeValue('teal.700', 'teal.200'),
    useColorModeValue('gray.50', 'gray.700'),
    useColorModeValue('white', 'gray.800')
  ]);

  const mermaidStyles = useMemo(() => {
    const styles = {
      [['.node rect', '.node circle', '.node polygon', '.node path']]: {
        strokeWidth: 2,
        stroke: primary,
        fill
      },
      [[
        '.node.secondary rect',
        '.node.secondary circle',
        '.node.secondary polygon',
        '.node.tertiary rect',
        '.node.tertiary circle',
        '.node.tertiary polygon'
      ]]: {
        fill: background
      },
      [[
        '.node.secondary rect',
        '.node.secondary circle',
        '.node.secondary polygon'
      ]]: {
        stroke: secondary
      },
      [[
        '.cluster rect',
        '.node.tertiary rect',
        '.node.tertiary circle',
        '.node.tertiary polygon'
      ]]: {
        stroke: tertiary
      },
      '.cluster rect': {
        fill: 'none',
        strokeWidth: 2
      },
      [['.label', '.edgeLabel']]: {
        background,
        lineHeight: 1.3,
        color: 'inherit'
      },
      '.edgeLabel rect': {
        background: 'none',
        fill: 'none'
      },
      [['.messageText', '.noteText', '.loopText']]: {
        fontSize: 12,
        stroke: 'none'
      },
      [['g rect', 'polygon.labelBox']]: {
        strokeWidth: 2
      },
      'g rect.actor': {
        stroke: tertiary,
        fill: background
      },
      'g rect.note': {
        stroke: secondary,
        fill: background
      },
      [['g line.loopLine', 'polygon.labelBox']]: {
        stroke: primary,
        fill: background
      },
      [['.label text', 'span']]: {
        color: 'inherit',
        fill: 'currentColor'
      },
      '.flowchart-link': {
        stroke: 'currentColor'
      },
      '.marker': {
        stroke: 'currentColor',
        fill: 'currentColor'
      }
    };
    return important(styles);
  }, [primary, secondary, tertiary, background, fill]);

  return mermaidStyles;
}
