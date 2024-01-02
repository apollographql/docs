import {important} from 'polished';
import {useColorModeValue, useToken} from '@chakra-ui/react';
import {useMemo} from 'react';

export function useMermaidStyles() {
  const [primary, secondary, tertiary, fill, background] = useToken('colors', [
    useColorModeValue('green.700', 'green.300'),
    useColorModeValue('yellow.500', 'yellow.300'),
    useColorModeValue('orange.700', 'orange.300'),
    useColorModeValue('blue.50', 'indigo.600'),
    'bg'
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
        lineHeight: 1.15,
        color: 'inherit'
      },
      '.edgeLabel rect': {
        background: 'none',
        fill: 'none'
      },
      [[
        '.messageText',
        '.noteText',
        '.labelText',
        '.loopText',
        '.loopText>tspan'
      ]]: {
        fill: 'currentColor',
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
      [['g line', 'svg>line']]: {
        stroke: tertiary
      },
      [['.actor-man line', '.actor-man circle']]: {
        stroke: tertiary,
        fill: background
      },
      [['.label text', 'span']]: {
        color: 'inherit',
        fill: 'currentColor'
      },
      [[
        '.edgePath .path',
        '.flowchart-link',
        '.messageLine0',
        '.messageLine1'
      ]]: {
        stroke: 'currentColor'
      },
      [['.marker', '#arrowhead path']]: {
        stroke: 'currentColor',
        fill: 'currentColor'
      },
      '.cluster-label': {
        lineHeight: '1.6em'
      },
      '.arrowheadPath': {
        fill: 'currentColor'
      },
      [['.noteText', 'text.actor']]: {
        tspan: {
          fill: 'currentColor'
        }
      },
      [['.label foreignObject', '.cluster-label foreignObject']]: {
        overflow: 'visible'
      },
      '*': {
        fontFamily: 'trebuchet ms,verdana,arial,sans-serif'
      }
    };
    return important(styles);
  }, [primary, secondary, tertiary, background, fill]);

  return mermaidStyles;
}
