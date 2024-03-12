import React from 'react';
import yaml from 'js-yaml';
import {graphql, useStaticQuery} from 'gatsby';

export const RouterErrorCodes = () => {
  const data = useStaticQuery(
    graphql`
      query RouterErrorCodes {
        allFile(
          filter: {
            extension: {eq: "yaml"}
            sourceInstanceName: {eq: "__PROGRAMMATIC__"}
          }
        ) {
          nodes {
            name
            fields {
              content
            }
          }
        }
      }
    `
  );

  return (
    <div>
      {data.allFile.nodes.map((file, index) => {
        const errors = yaml.load(file.fields.content);

        return (
          <div key={index}>
            <h1>{decodeURIComponent(file.name)}</h1>
            {errors.map((error, index) => {
              console.log(error);
              return (
                <div key={index}>
                  <h2>{error.code}</h2>
                  <p>{error.detail}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
