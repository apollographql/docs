import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {NavContext} from '../utils';

function DocsetButton({to, ...props}) {
  const {uri} = useContext(NavContext);
  return (
    <Button
      as={GatsbyLink}
      to={to}
      colorScheme={uri === to ? 'indigo' : 'gray'}
      {...props}
    />
  );
}

DocsetButton.propTypes = {
  to: PropTypes.string.isRequired
};

function DocsetGroup({title, children}) {
  return (
    <>
      <Heading mb="2" size="sm">
        {title}
      </Heading>
      <ButtonGroup>{children}</ButtonGroup>
    </>
  );
}

DocsetGroup.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default function DocsetMenu({label}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        size="xs"
        fontSize="sm"
        roundedRight="0"
        colorScheme="indigo"
      >
        {label}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Box p="6">
            <DocsetButton to="/">Apollo Basics</DocsetButton>
            <DocsetGroup title="Client">
              <DocsetButton to="/react">React</DocsetButton>
              <DocsetButton to="/ios">iOS</DocsetButton>
              <DocsetButton to="/kotlin">Kotlin</DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Backend">
              <DocsetButton to="/apollo-server">Server</DocsetButton>
              <DocsetButton to="/federation">Federation</DocsetButton>
              <DocsetButton to="/router">Router</DocsetButton>
            </DocsetGroup>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}

DocsetMenu.propTypes = {
  label: PropTypes.string.isRequired
};
