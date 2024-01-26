import path from "node:path";

import degit from "degit";

const config = {
  "apollographql/apollo-client/docs/source": "react",
  "apollographql/apollo-federation/docs/source": "apollo-server",
  "apollographql/apollo-kotlin/docs/source": "kotlin",
  "apollographql/apollo-ios-dev/docs/source": "ios",
};

await Promise.all(
  Object.entries(config).map(([from, to]) =>
    degit(from, {
      force: true,
    }).clone(path.join("src/content/docs", to)),
  ),
);
