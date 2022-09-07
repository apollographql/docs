import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FlexProps,
  useColorModeValue,
  useToken
} from '@chakra-ui/react';
import {BsChevronLeft} from '@react-icons/all-files/bs/BsChevronLeft';
import {BsChevronRight} from '@react-icons/all-files/bs/BsChevronRight';
import {GA_EVENT_CATEGORY_CODE_BLOCK} from './CodeBlock';
import {MultiCodeBlockContext} from './MultiCodeBlock';
import {TinyColor} from '@ctrl/tinycolor';
import {getIconComponent} from './language-util';
import {usePrismTheme} from './prism';

function getTabButtonProps(
  loc: 'LEFT' | 'RIGHT',
  visible: boolean,
  gradientColor: TinyColor
): FlexProps {
  const endColor = gradientColor.clone().setAlpha(0);

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
    background: `linear-gradient(${[
      loc === 'LEFT' ? '90deg' : '270deg',
      `${gradientColor.toRgbString()} 50%`,
      endColor.toRgbString()
    ]})`,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',
    transition: 'all 250ms ease-in-out',
    cursor: 'pointer'
  };
}

interface CodeBlockTabsProps {
  languages: string[];
  activeLanguage: string;
  setLanguage?: (language: string) => void;
}

export const CodeBlockTabs = ({
  languages,
  activeLanguage,
  setLanguage
}: CodeBlockTabsProps): JSX.Element => {
  // Track inner (infinite width) and outer (container width) boxes using refs
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // Track the scroll position, represented as [0,1] inclusive
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track tabs scroll position to determine if arrows are necessary
  useEffect(() => {
    if (!outerRef.current) return;
    const el = outerRef.current;
    const onScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      setScrollPosition(el.scrollLeft / maxScroll);
    };
    outerRef.current.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, [outerRef]);

  // Allow for arrow presses to induce a short scroll left or right
  const bumpScroll = (distance: number) => () => {
    if (!outerRef) return;
    outerRef.current?.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  };

  const theme = usePrismTheme();
  const bgColor = useToken('colors', 'gray.800');
  const gradientColor = useColorModeValue(
    new TinyColor('white'),
    new TinyColor(bgColor)
  );

  // Determine which arrows (if any) need to be shown
  const showArrows = Boolean(
    innerRef.current &&
      outerRef.current &&
      innerRef.current.clientWidth > outerRef.current.clientWidth
  );
  // Determine if the left or right arrows should be shown based on overall
  // visibility, and the scroll position
  const showLeftArrow = showArrows && scrollPosition > 0;
  const showRightArrow = showArrows && scrollPosition < 1;

  return (
    <Box pos="relative" pt="1" zIndex="0">
      <Flex
        {...getTabButtonProps('LEFT', showLeftArrow, gradientColor)}
        onClick={bumpScroll(-120)}
      >
        <BsChevronLeft />
      </Flex>
      <Box
        overflowX="auto"
        pos="relative"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }}
        ref={outerRef}
      >
        <ButtonGroup
          size="xs"
          role="tablist"
          ref={innerRef}
          display="flex"
          flexDirection="row"
          w="max-content"
        >
          {languages.map(language => (
            <Button
              leftIcon={getIconComponent(language)}
              key={language}
              onClick={() => {
                if (setLanguage) {
                  setLanguage(language);
                }
                window.gtag?.('event', 'Change language', {
                  event_category: GA_EVENT_CATEGORY_CODE_BLOCK,
                  event_label: language
                });
              }}
              roundedBottom="none"
              bg={
                language !== activeLanguage
                  ? theme.plain.backgroundColor
                  : undefined
              }
              role="tab"
              aria-selected="true"
              mt="1"
              flexShrink={0}
            >
              {language}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Flex
        {...getTabButtonProps('RIGHT', showRightArrow, gradientColor)}
        onClick={bumpScroll(120)}
      >
        <BsChevronRight />
      </Flex>
    </Box>
  );
};
