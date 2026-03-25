// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // Metro handles platform/module resolution; this rule is noisy in RN/Expo.
      "import/no-unresolved": "off",
    },
  },
]);
