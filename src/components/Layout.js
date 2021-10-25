import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

export default function Layout({children}) {
  return (
    <>
      <Helmet
        titleTemplate="%s - Apollo GraphQL Docs"
        defaultTitle="Apollo GraphQL Docs"
      />
      {children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
