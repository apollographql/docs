import PropTypes from 'prop-types';
import React from 'react';
import {Collapse, IconButton, useDisclosure} from '@chakra-ui/react';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';

export default function ExpansionPanel({children, title}) {
  const {isOpen, onToggle} = useDisclosure();
  return (
    <div>
      <h3>{title}</h3>
      <IconButton
        icon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
        onClick={onToggle}
      />
      <Collapse in={isOpen}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
}

ExpansionPanel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};
