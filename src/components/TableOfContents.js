import GithubSlugger from 'github-slugger';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useState} from 'react';
import {Link, List, ListItem, useColorModeValue} from '@chakra-ui/react';

export default function TableOfContents({headings}) {
  const activeColor = useColorModeValue('indigo.500', 'indigo.200');
  const [activeId, setActiveId] = useState(null);

  const toc = useMemo(() => {
    const slugger = new GithubSlugger();
    return headings.map(heading => ({
      ...heading,
      id: slugger.slug(heading.value)
    }));
  }, [headings]);

  useEffect(() => {
    function handleScroll(event) {
      const {scrollY, innerHeight} = event.currentTarget;
      const halfway = scrollY + innerHeight / 2;
      for (let i = toc.length - 1; i >= 0; i--) {
        const {id} = toc[i];
        const {offsetTop} = document.getElementById(id);
        if (offsetTop <= halfway) {
          setActiveId(id);
          break;
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  return (
    <List spacing="2.5">
      {toc.map(({id, value, depth}, index) => (
        <ListItem key={index} pl={(depth - 2) * 2} lineHeight="normal">
          <Link href={'#' + id} color={id === activeId && activeColor}>
            {value}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}

TableOfContents.propTypes = {
  headings: PropTypes.array.isRequired
};
