---
title: GraphQL Glossary
subtitle: Familiarize yourself with common GraphQL terms
description: Glossary of common GraphQL terminology
---

As you explore the GraphQL ecosystem, you might encounter some unfamiliar terms and phrases along the way. To help you on your journey, we've defined some of the most common GraphQL vocabulary here in this handy cheat sheet.

## Alias

A mechanism for including multiple instances of a single field in a GraphQL operation. This enables you to provide different argument values to each instance.

```graphql
query AdminsAndManagers {
  admins: users(role: "admin") {
    id
    firstname
    lastname
  }
  managers: users(role: "manager") {
    id
    firstname
    lastname
  }
}
```

The query above uses `admins` and `managers` as aliases for the `users` field.

## Argument

A key-value pair associated with a particular [schema](#schema) field, enabling operations to pass data to that field's [resolver](#resolver). Argument values can be hardcoded as literal values (shown below for clarity) or provided via GraphQL [variables](#variable) (recommended).

```graphql
query GetHuman {
  human(id: "200") {
    name
    height(unit: "meters")
  }
}
```

The query above provides two arguments:

- The `id` argument for the `human` field (indicating which `Human` object to return)
- The `unit` argument for the `height` field (indicating which unit of measurement to use for the return value)

## Automatic persisted queries (APQ)

A technique for improving GraphQL network performance by enabling clients to execute operations by passing an identifier, instead of by passing the entire operation string.

For very large operation strings, APQ meaningfully reduces bandwidth use and speeds up client loading times.

[Learn more about APQ.](/apollo-server/performance/apq/)

## Data source

A pattern for fetching data from a particular service, with built-in support for caching, deduplication, and error handling. When deploying GraphQL as a layer between your apps and existing APIs and services, [data sources](/apollo-server/data/fetching-rest) provide the best experience for fetching and caching data from REST endpoints.

## Deferred query

A query that has certain fields tagged with the `@defer` directive, indicating that the GraphQL server can return all _other_ fields before the deferred fields are ready. The server can then return the deferred fields in subsequent payloads.

```graphql
query NewsFeed {
  newsFeed {
    stories {
      text
      # highlight-start
      ... @defer {
        comments {
          text
        }
      }
      #highlight-end
    }
  }
}
```

By deferring slow-to-resolve fields, a client can receive _other_ data as quickly as possible.

[Learn how to use `@defer` with Apollo GraphOS.](/graphos/operations/defer)

## Directive

A declaration prefixed with `@` that you apply to various locations in a GraphQL schema or operation:

```graphql
type User {
  username: String! @lowerCase
}
```

A directive usually has some associated logic that modifies the behavior of the associated location. For example, the `@lowerCase` directive above might define logic to always convert the `username` field to lower case before returning it.

GraphQL includes some built-in directives (such as `@deprecated`), and you can also define [custom directives](https://www.apollographql.com/docs/apollo-server/v3/schema/creating-directives/).


## Docstring

Provides the description of a type, field, or argument. Docstrings automatically appear in many common GraphQL tools, including the GraphOS Studio Explorer.

```graphql
"""
Description for the User
"""
type User {
  """
  Description for first Name
  """
  firstName: String!

  age(
    """
    Must be an integer
    """
    arg: Int
  )
}
```

## Document

A file or request string that contains one or multiple definitions of a GraphQL type system and can be interpreted by a GraphQL execution engine.

Most Apollo libraries use the `gql` template literal to create GraphQL documents:

```js
// A schema document created with the gql template literal
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;
```

## Extensions

A GraphQL operation's response can include an `extensions` object to provide metadata about the operation:

```json {12-14}
{
  "data": {
    "books": [
      {
        "title": "The Awakening"
      },
      {
        "title": "City of Glass"
      }
    ]
  },
  "extensions": {
    "timestamp": 1633038919
  }
}
```

The `extensions` object can have any structure. GraphQL servers can use this object to include timing data, additional error details, or any other helpful information.

## Field

A unit of data that belongs to a type in your schema. Every GraphQL query requests one or more fields.

```graphql
type Author {
  id: Int!
  firstName: String
  lastName: String
}
```

In the schema definition above, `id`, `firstName`, and `lastName` are fields of the `Author` type.

## Fragment

A selection set of fields that can be shared between multiple query operations. [See the documentation.](/react/data/fragments/)

```graphql
fragment UserData on User {
  id: ID!
  firstName: String!
  lastName: String!
}

query getUsers {
  allUsers {
    ...UserData
  }
}
```

## `gql` function

A [JavaScript template literal tag](https://github.com/apollographql/graphql-tag) that parses GraphQL queries into an abstract syntax tree (AST).

```js
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;
```

## GraphQL server

A server that contains a GraphQL schema and can resolve operations that are executed against that schema. [Apollo Server](/apollo-server/) is an example of a GraphQL server.

## Introspection

A special query that enables clients and tools to fetch a GraphQL server's complete schema. Types and fields used in introspection are prefixed with `__` (two underscores).

Introspection should be [disabled in production](https://www.apollographql.com/blog/graphql/security/why-you-should-disable-graphql-introspection-in-production/).

```graphql
{
  __schema {
    types {
      name
    }
  }
}
```

## Mutation

A GraphQL operation that creates, modifies, or destroys data. [See the documentation](/react/data/mutations/).

```graphql
mutation AddTodo($type: String!) {
  addTodo(type: $type) {
    id
    type
  }
}
```

## Normalization

A technique for transforming the response of a query operation before saving it to Apollo Client's in-memory cache. The result is split into individual objects, creating a unique identifier for each object, and storing those objects in a flattened data structure. [See the documentation.](/react/caching/overview#data-normalization)

## Object Type

A type in a GraphQL schema that has one or more fields.

```graphql
type User {
  name: String!
}
```

`User` is an object type in the example above.

## Operation

A single query, mutation, or subscription that can be interpreted by a GraphQL execution engine.

## Operation name

The name of a particular query, mutation, or subscription. You should provide a name for every operation to improve logging and debugging output when an error occurs.

```graphql
mutation AddTodo($type: String!) {
  addTodo(type: $type) {
    id
    type
  }
}

query GetHuman {
  human(id: "200") {
    name
    height(unit: "meters")
  }
}
```

The operations above are named `AddTodo` and `GetHuman`.

## Operation signature

The normalized representation of a particular GraphQL operation (query, mutation, or subscription). Normalizing an operation transforms it deterministically to reduce the number of possible forms it could take. For example, many normalization algorithms sort an operation's fields alphabetically.

Other normalization algorithms replace in-line variables(literals) with empty, null, or zero values, sort fragments, remove whitespace, or remove aliases.

The following example shows the [default signature algorithm for GraphOS metrics reporting](/graphos/metrics/operation-signatures/).

Here's an operation definition _before_ normalization:

```
query getHuman {
  human(id: 200) {
    pounds: weight(unit: "pounds")
    height
  }
}
```

And here's that operation's signature after normalization, which hides literals, sorts fields, removes aliases, and removes whitespace:

```
query getHuman { human(id: 0) { height weight(unit: "") } }
```

## Partial query caching

A technique for caching inputs to GraphQL queries. This type of caching ensures that if the query is slightly different but with the same inputs, those inputs can simply be retrieved from the cache instead of fetching data again from the backend. This is implemented in the [`RESTDataSource`](/apollo-server/data/fetching-rest) class, which Apollo Server can use to fetch data from REST APIs.

## Query

A read-only fetch operation to request data from a GraphQL server.

## Query colocation

A practice of placing a GraphQL query in the same location as the app component that uses that query to render itself. This practice makes it easier to fetch data and render your UI responsively.

```jsx
const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

function ExchangeRates() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}
```

## Resolver

A function that populates data for a particular field in a GraphQL schema. A resolver can define any custom logic to populate its data, but it usually involves fetching from a data source (such as a database, REST API, or other microservice).

[Learn about resolvers in Apollo Server.](/apollo-server/data/resolvers/)

```js
const resolvers = {
  Query: {
    author(root, args, context, info) {
      return find(authors, { id: args.id });
    },
  },
  Author: {
    books(author) {
      return filter(books, { author: author.name });
    },
  },
};
```

## Schema

A GraphQL [schema](/apollo-server/schema/schema/) is at the center of any GraphQL server implementation and describes the functionality available to the clients which connect to it.

## Schema Definition Language (SDL)

The syntax for writing GraphQL schemas. All GraphQL APIs can use SDL to represent their schema, regardless of which _programming_ language the API is implemented in.


```graphql
type Author {
  id: Int!
  firstName: String
  lastName: String
  posts: [Post]
}

type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}

type Query {
  posts: [Post]
  author(id: Int!): Author
}
```

## Schema-first development

A development approach for designing and building modern UIs that involves the frontend and backend teams agreeing on a Schema first, which serves as a contract between the UI and the backend before any API engineering happens.

## Schema registry

The central source of truth for your schema. It enables schema registration, schema checks, tracking of detailed schema changes (such types added, fields added, and fields deprecated), and looking up previous versions of a schema.

## Schema versioning

Refers to the need to evolve a schema over time. As a schema evolves, there's the potential to introduce breaking changes to clients. Apollo GraphOS assists with schema evolution by checking proposed schema changes for breaking changes. [Learn more about schema checks.](/graphos/delivery/schema-checks/)

## Subscription

A long-lived, real-time GraphQL operation. Supported [subscriptions](/apollo-server/data/subscriptions) are defined in a schema along with queries and mutations.

```graphql
type Subscription {
  commentAdded(repoFullName: String!): Comment
}
...
subscription onCommentAdded($repoFullName: String!){
  commentAdded(repoFullName: $repoFullName){
    id
    content
  }
}
```

## Scalar type

A "base" type in GraphQL that resolves to a single value. GraphQL includes the following scalar types by default: `Int`, `Float`, `String`, `Boolean`, and `ID`.

You can also define [custom scalars](/apollo-server/schema/custom-scalars/). [Learn more about the default scalar types](https://graphql.com/learn/types/#introducing-scalar-types).

## Type system

A collection of types that characterizes the set of data that can be validated, queried, and executed on a GraphQL API.

## Variable

A value that can be passed to an operation. Variables can be used to fill arguments, or be passed to directives.

```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    firstName
  }
}
```

In the query above, `userId` is a variable. The variable and its type are declared in the operation signature, signified by a `$`. The type of the variable here is a non-nullable `ID`. A variable's type _must_ match the type of any argument it's used for.

The `userId` variable is included in the operation by Apollo Client like so:

```js
client.query({ query: getUserQuery, variables: { userId: 1 } });
```

## Whole response caching

A technique used to cache entire results of GraphQL queries. This process improves performance by preventing the fetching of the same results from the server if it has been obtained before. Read more about GraphQL query caching in our [guide for caching with Apollo Server](/apollo-server/performance/caching).
