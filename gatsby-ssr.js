import PageLayout from './src/components/PageLayout';
import React from 'react';
import {
  DOCS_PAGE_WIDTH_VAR,
  PAGE_JUMBO_WIDTH,
  PAGE_NORMAL_WIDTH
} from './src/components/PageWidthContext';
import {withPrefix} from 'gatsby';

export const wrapPageElement = ({element, props}) => (
  <PageLayout {...props}>{element}</PageLayout>
);

const headComponents = [
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
  //   <script type="text/javascript">
  // 	window.ATL_JQ_PAGE_PROPS = {
  // 		"triggerFunction": function(showCollectorDialog) {
  // 			jQuery("#jira-issue-collector").click(function(e) {
  // 				e.preventDefault();
  // 				showCollectorDialog();
  // 			});
  // 		}
  // 	};
  // </script>,
  <style
    key="font-face"
    dangerouslySetInnerHTML={{
      __html: `
        @font-face {
          font-family: "Aeonik";
          font-style: normal;
          font-weight: 500;
          font-display: swap;
          src: url(${withPrefix(
            '/fonts/aeonik/Aeonik-Medium.woff2'
          )}) format("woff2");
        }
      `
    }}
  />
];

if (process.env.CONTEXT === 'production') {
  headComponents.push(
    <script
      key="qualified-js"
      id="qualified-js"
      async
      src="https://js.qualified.com/qualified.js?token=mdpGqx2V2oJXA51Q" // gitleaks:allow
    />
  );
}

export const onRenderBody = ({setHeadComponents, setHtmlAttributes}) => {
  setHeadComponents(headComponents);
  setHtmlAttributes({lang: 'en'});
};
