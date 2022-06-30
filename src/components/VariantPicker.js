import React, {useState} from 'react';
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
  const [currentOrg, setCurrentOrg] = useState(null);
  const [currentGraph, setCurrentGraph] = useState(null);
  const {loading, error, data} = useQuery(GET_VISIBLE_VARIANTS);
  const handleOrgChange = event => {
    setCurrentOrg(orgs.find(org => org.id === event.target.value));
  };
  const handleGraphChange = event => {
    setCurrentGraph(
      currentOrg.services.find(graph => graph.id === event.target.value)
    );
  };

  if (loading) return 'Loading...';
  if (error) return error.message;
  if (!data.me) return 'Not logged in!';
  const orgs = data.me.memberships.map(membership => membership.account);
  const orgOptions = orgs.map(org => {
    return (
      <option key={org.id} value={org.id}>
        {org.name}
      </option>
    );
  });

  let graphOptions = [];
  if (currentOrg) {
    graphOptions = currentOrg.services.map(graph => {
      return (
        <option key={graph.id} value={graph.id}>
          {graph.id}
        </option>
      );
    });
  }

  let variantOptions = [];
  if (currentGraph) {
    variantOptions = currentGraph.variants.map(variant => {
      return (
        <option key={variant.name} value={variant.name}>
          @{variant.name}
        </option>
      );
    });
  }

  return (
    <>
      <select onChange={handleOrgChange}>{orgOptions}</select>
      <select onChange={handleGraphChange}>{graphOptions}</select>
      <select>{variantOptions}</select>
    </>
  );
}
