import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import {
  Button,
  Collapse,
  Flex,
  HStack,
  Stack,
  Tooltip,
  chakra
} from '@chakra-ui/react';
import {FiChevronDown, FiChevronRight, FiExternalLink} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {IoFlaskOutline, IoPartlySunnyOutline} from 'react-icons/io5';
import {PathContext, getFullPath, isPathActive, isUrl} from '../../utils';
import {TbComponents} from 'react-icons/tb';

export const GA_EVENT_CATEGORY_SIDEBAR = 'Sidebar';
export const NavContext = createContext();

const getItemPaths = (items, basePath) =>
  items.flatMap(({path, children}) =>
    children ? getItemPaths(children, basePath) : getFullPath(path, basePath)
  );

const Tags = ({tags}) => {
  return (
    <>
      {tags.map((tag, index) => {
        let tagIcon;
        let tagTooltip;

        switch (tag) {
          case 'enterprise':
            tagIcon = <TbComponents />;
            tagTooltip = 'Enterprise feature';
            break;
          case 'graphos':
            tagIcon = <TbComponents />;
            tagTooltip = 'Requires GraphOS';
            break;
          case 'preview':
            tagIcon = <IoPartlySunnyOutline />;
            tagTooltip = 'Preview feature';
            break;
          case 'experimental':
            tagIcon = <IoFlaskOutline />;
            tagTooltip = 'Experimental feature';
            break;
          default:
            return null;
        }
        return (
          <Tooltip key={index} label={tagTooltip} fontSize="md">
            <chakra.span ml="6px">{tagIcon}</chakra.span>
          </Tooltip>
        );
      })}
    </>
  );
};

Tags.propTypes = {
  tags: PropTypes.array.isRequired
};

function NavButton({isActive, depth, children, tags, ...props}) {
  return (
    <Button
      h="auto"
      py="2"
      lineHeight="base"
      whiteSpace="normal"
      variant="ghost"
      fontWeight="normal"
      textAlign="left"
      justifyContent="flex-start"
      data-depth={depth}
      sx={
        isActive && {
          bg: 'purple.500',
          color: 'white',
          _hover: {
            bg: 'purple.600'
          },
          _active: {
            bg: 'purple.700'
          }
        }
      }
      {...props}
    >
      <Flex as="span" align="center">
        {children} {tags && <Tags tags={tags} />}
      </Flex>
    </Button>
  );
}

NavButton.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  depth: PropTypes.number.isRequired,
  tags: PropTypes.array
};

function NavGroup({group, depth}) {
  const {nav, setNav} = useContext(NavContext);
  const {basePath, uri} = useContext(PathContext);

  const isOpen = nav[group.id];
  const isActive = getItemPaths(group.children, basePath).some(path =>
    isPathActive(path, uri)
  );

  return (
    <div>
      <HStack
        as="button"
        py="2"
        fontWeight="strong"
        css={{scrollMarginTop: 56}}
        data-group={!depth && isActive}
        onClick={() => {
          const open = !isOpen;
          setNav({
            ...nav,
            [group.id]: open
          });
          window.gtag?.('event', 'Toggle category', {
            event_category: GA_EVENT_CATEGORY_SIDEBAR,
            event_label: group.title,
            value: Number(open)
          });
        }}
      >
        <span>{group.title}</span>
        {isOpen ? <FiChevronDown /> : <FiChevronRight />}
      </HStack>
      <Collapse unmountOnExit in={isOpen}>
        <NavItems
          uri={uri}
          items={group.children}
          basePath={basePath}
          depth={depth + 1}
        />
      </Collapse>
    </div>
  );
}

NavGroup.propTypes = {
  group: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired
};

export default function NavItems({items, depth = 0}) {
  const {basePath, uri} = useContext(PathContext);
  return (
    <Stack
      sx={
        // add some extra padding to sidebar groups
        depth > 0 && {
          pt: 2,
          pb: 1
        }
      }
    >
      {items.map((item, index) => {
        if (item.children) {
          return <NavGroup key={index} group={item} depth={depth} />;
        }

        if (isUrl(item.path)) {
          const buttonProps = !item.path.startsWith(
            'https://www.apollographql.com'
          ) && {
            target: '_blank',
            rel: 'noreferrer noopener',
            rightIcon: <FiExternalLink />
          };
          return (
            <NavButton
              key={index}
              as="a"
              depth={depth}
              href={item.path}
              tags={item.tags}
              {...buttonProps}
            >
              {item.title}
            </NavButton>
          );
        }

        const path = getFullPath(item.path, basePath);
        const isActive = isPathActive(path, uri);
        return (
          <NavButton
            key={index}
            isActive={isActive}
            depth={depth}
            as={GatsbyLink}
            to={path}
            tags={item.tags}
          >
            {item.title}
          </NavButton>
        );
      })}
    </Stack>
  );
}

NavItems.propTypes = {
  items: PropTypes.array.isRequired,
  depth: PropTypes.number,
  tags: PropTypes.array
};
