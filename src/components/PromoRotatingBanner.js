import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Center,
  Flex,
  SlideFade,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import {FaChevronRight, FaMicrophone} from 'react-icons/fa';

function BannerMessage({key, message, icon, url, cta}) {
  return (
    <SlideFade key={key} in offsetY="-30px">
      <Flex
        justifyContent="center"
        alignItems="center"
        as="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {message}
        <Text ml="2" fontWeight="semibold">
          {cta}
        </Text>
        {icon}
      </Flex>
    </SlideFade>
  );
}

BannerMessage.propTypes = {
  key: PropTypes.number.isRequired,
  icon: PropTypes.node,
  message: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  cta: PropTypes.string.isRequired
};

const bannerMessagesData = [
  {
    icon: <FaChevronRight />,
    message: 'Join us for GraphQL Summit, on October 10-12!',
    cta: 'Get your super early birds tickets now',
    url: 'https://summit.graphql.com/?utm_campaign=2023-03-21_GraphQLSummit&utm_medium=website&utm_source=apollo'
  },
  {
    icon: <FaMicrophone />,
    message: 'Share your GraphQL expertise with the world at GraphQL Summit!',
    cta: 'Submit your talk now',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScYpmuJuPkoSxPnpcHRPjx_IKCQ5FwvsXnPTdhsmON_wAubJQ/viewform'
  }
];

export default function PromoBanner() {
  const bgHover = useColorModeValue('indigo.100', 'indigo.700');
  const bannerBg = useColorModeValue('indigo.50', 'indigo.800');
  const textColor = useColorModeValue('indigo.500', 'indigo.50');
  const [contentIdx, setContentIdx] = useState(0);
  const contentArray = useMemo(
    () =>
      bannerMessagesData.map((data, idx) => (
        <BannerMessage
          key={idx}
          icon={data.icon}
          message={data.message}
          cta={data.cta}
          url={data.url}
        />
      )),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentIdx >= contentArray.length - 1) {
        setContentIdx(0);
      } else {
        setContentIdx(contentIdx + 1);
      }
    }, 12 * 1000);
    return () => clearTimeout(timer);
  }, [contentIdx, contentArray.length]);

  return (
    <Center
      _hover={{bg: bgHover}}
      height="32px"
      bgColor={bannerBg}
      color={textColor}
    >
      {contentArray[contentIdx]}
    </Center>
  );
}
