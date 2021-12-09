import React from 'react';

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
    />
  ]);
