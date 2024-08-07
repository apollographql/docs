import React from 'react';
import yaml from 'js-yaml';
import {ErrorCode} from './ErrorCode';
import {PropertyList} from './PropertyList';
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
            <PropertyList kind="errCodes">
              {errors.map((error, index) => {
                console.log(error);
                return (
                  <>
                    <ErrorCode
                      key={index}
                      code={error.code}
                      detail={error.detail}
                      type={error.type}
                      origin={error.origin}
                      level={error.level}
                    />
                  </>
                );
              })}
            </PropertyList>
          </div>
        );
      })}
    </div>
  );
};
