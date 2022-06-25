import React from 'react';
import {gql, useQuery} from '@apollo/client';

const GET_VISIBLE_VARIANTS = gql`
  query GetVisibleVariants {
    me {
      ... on User {
        memberships {
          account {
            id
            name
            services {
              id
              variants {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export default function VariantPicker() {
  const {loading, error, data} = useQuery(GET_VISIBLE_VARIANTS);
  if (loading) return 'Loading...';
  if (error) return error.message;
  if (!data.me) return 'Not logged in!';
  const orgs = data.me.memberships.map(membership => membership.account);
  const allVariants = orgs.map(org => {
    <li key={org.id}>
      <strong>{org.name}</strong>
      <ul>
        {org.services.map(graph => {
          <li key={graph.id}>
            <code>{graph.id}</code>
            <ul>
              {graph.variants.map(variant => {
                <li key={variant.name}>
                  <code>@{variant.name}</code>
                </li>;
              })}
            </ul>
          </li>;
        })}
      </ul>
    </li>;
  });
  return <ul>{allVariants}</ul>;
}
