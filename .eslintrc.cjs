// @ts-check

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: [
    "@trevorblades",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:mdx/recommended",
  ],
};
