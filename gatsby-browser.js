import PageLayout from './src/components/PageLayout';
import React from 'react';

export const wrapPageElement = ({element, props}) => (
  <PageLayout {...props}>{element}</PageLayout>
);
