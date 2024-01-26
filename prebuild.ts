import { deleteAsync } from "del";
import { downloadTemplate } from "giget";

const config = {
  "apollographql/apollo-client/docs/source": "react",
  "apollographql/apollo-client/docs/source#version-2.6": "react/v2",
  "apollographql/apollo-server/docs/source": "apollo-server",
  "apollographql/apollo-server/docs/source#version-3": "apollo-server/v3",
  "apollographql/apollo-server/docs/source#version-2": "apollo-server/v2",
  "apollographql/apollo-kotlin/docs/source": "kotlin",
  // "apollographql/apollo-ios-dev/docs/source": "ios",
};

// copy each docset's source files into the docs content folder
await Promise.all(
  Object.entries(config).map(([from, to]) =>
    downloadTemplate(from, {
      dir: to,
      provider: "github",
      force: true,
      cwd: "src/content/docs",
    }),
  ),
);

// delete all files that astro might consider data
await deleteAsync("src/content/docs/**/*.{json,yaml,yml}");
