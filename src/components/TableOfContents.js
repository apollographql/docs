import GithubSlugger from 'github-slugger';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Link, List, ListItem} from '@chakra-ui/react';

const MIN_HEADING_DEPTH = 2;
const MAX_HEADING_DEPTH = 3;

export default function TableOfContents({
  headings,
  headingDepth = MAX_HEADING_DEPTH
}) {
  const [activeId, setActiveId] = useState(null);
  const scrollDisabled = useRef(false);
  const toc = useMemo(() => {
    const slugger = new GithubSlugger();
    return headings
      .filter(
        heading =>
          heading.depth >= MIN_HEADING_DEPTH && heading.depth <= headingDepth
      )
      .map(heading => ({
        ...heading,
        id: slugger.slug(heading.value)
      }));
  }, [headings, headingDepth]);

  useEffect(() => {
    function handleScroll(event) {
      if (scrollDisabled.current) {
        scrollDisabled.current = false;
        return;
      }

      const halfway = event.currentTarget.innerHeight / 2;
      for (let i = toc.length - 1; i >= 0; i--) {
        const {id} = toc[i];
        const heading = document.getElementById(id);
        if (heading) {
          const {top} = heading.getBoundingClientRect();
          if (top <= halfway) {
            setActiveId(id);
            break;
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  return (
    <List overflow="auto" spacing="3.5">
      {toc.map(({id, value, depth}, index) => {
        const isActive = id === activeId;
        return (
          <ListItem
            key={index}
            pl={(depth - MIN_HEADING_DEPTH) * 6}
            lineHeight="normal"
          >
            <Link
              href={'#' + id}
              color={isActive && 'primary'}
              fontWeight={isActive && 'semibold'}
              onClick={event => {
                setActiveId(id);
                scrollDisabled.current = true;
                window.gtag?.('event', 'Heading click', {
                  event_category: 'Section Nav',
                  event_label: event.target.innerText
                });
              }}
            >
              {value}
            </Link>
          </ListItem>
        );
      })}
    </List>
  );
}

TableOfContents.propTypes = {
  headings: PropTypes.array.isRequired,
  headingDepth: PropTypes.number
};
