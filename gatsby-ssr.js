import PageLayout from './src/components/PageLayout';
import React from 'react';
import {
  DOCS_PAGE_WIDTH_VAR,
  PAGE_JUMBO_WIDTH,
  PAGE_NORMAL_WIDTH
} from './src/components/PageWidthContext';

export const wrapPageElement = ({element, props}) => (
  <PageLayout {...props}>{element}</PageLayout>
);

export const onRenderBody = ({setHeadComponents}) =>
  setHeadComponents([
    <script
      key="ff"
      dangerouslySetInnerHTML={{
        __html: `
          var ffWidgetId = '3131c43c-bfb5-44e6-9a72-b4094f7ec028';
          var ffWidgetScript  = document.createElement('script');
          ffWidgetScript.type = 'text/javascript';
          ffWidgetScript.src = 'https://freddyfeedback.com/widget/freddyfeedback.js';
          document.head.appendChild(ffWidgetScript);
        `
      }}
    />,
    <script
      key="extend-fix"
      dangerouslySetInnerHTML={{
        __html: `
          const pageWidth = JSON.parse(localStorage.getItem('page-width') ?? "\\"normal\\"");
          
          const PAGE_NORMAL_WIDTH = ${PAGE_NORMAL_WIDTH};
          const PAGE_JUMBO_WIDTH = ${PAGE_JUMBO_WIDTH};

          const pageWidthPx = (pageWidth === 'normal' ? PAGE_NORMAL_WIDTH : PAGE_JUMBO_WIDTH) + 'px';

          const root = document.querySelector(':root');
          root.style.setProperty('${DOCS_PAGE_WIDTH_VAR}', pageWidthPx);
        `
      }}
    />,
    <script
      key="qualified-js"
      id="qualified-js"
      async
      src="https://js.qualified.com/qualified.js?token=mdpGqx2V2oJXA51Q"
      />
  ]);
