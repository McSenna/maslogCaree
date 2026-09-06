module.exports = {
  stories: [
    "../src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../app/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-controls",
    "@storybook/addon-actions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-native",
    options: {},
  },
};
