import { deleteAsync } from "del";
import { downloadTemplate } from "giget";

const config = {
  react: "apollographql/apollo-client/docs/source",
  "react/v2": "apollographql/apollo-client/docs/source#version-2.6",
  "apollo-server": "apollographql/apollo-server/docs/source",
  "apollo-server/v3": "apollographql/apollo-server/docs/source#version-3",
  "apollo-server/v2": "apollographql/apollo-server/docs/source#version-2",
  kotlin: "apollographql/apollo-kotlin/docs/source",
  // ios: "apollographql/apollo-ios-dev/docs/source",
} satisfies Record<string, string>;

// copy each docset's source files into the docs content folder
await Promise.all(
  Object.entries(config).map(([path, repo]) =>
    downloadTemplate(repo, {
      dir: path,
      provider: "github",
      force: true,
      cwd: "src/content/docs",
    }),
  ),
);

// delete all files that astro might consider "data"
await deleteAsync("src/content/docs/**/*.{json,yaml,yml}");
