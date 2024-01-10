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
  const [pageHeadings, setPageHeadings] = useState(headings);
  useEffect(() => {
    setPageHeadings(
      [
        ...document
          .querySelector('main')
          .querySelectorAll('h2[id],h3[id],h4[id],h5[id],h6[id]')
          .values()
      ].map(heading => {
        const link = heading.querySelector('a');
        return {
          value: heading.title || link.innerText || heading.innerText,
          depth: parseInt(heading.tagName[1]),
          id: heading.id
        };
      })
    );
  }, []);

  const toc = useMemo(() => {
    const slugger = new GithubSlugger();
    return pageHeadings
      .filter(
        heading =>
          heading.depth >= MIN_HEADING_DEPTH && heading.depth <= headingDepth
      )
      .map(heading => ({
        id: slugger.slug(heading.value),
        ...heading
      }));
  }, [pageHeadings, headingDepth]);

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
