import Layout from './src/components/Layout';
import React from 'react';

export const wrapPageElement = ({element, props}) => (
  <Layout {...props}>{element}</Layout>
);
