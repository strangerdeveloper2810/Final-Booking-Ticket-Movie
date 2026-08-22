const { merge } = require("webpack-merge");
const commonConfig = require("./config/webpack.common.js");
const devConfig = require("./config/webpack.dev.js");
const prodConfig = require("./config/webpack.prod.js");

module.exports = (env, argv) => {
  const mode = argv.mode || process.env.NODE_ENV || "development";
  switch (mode) {
    case "development":
      return merge(commonConfig, devConfig);
    case "production":
      return merge(commonConfig, prodConfig);
    default:
      throw new Error(`No matching Webpack configuration found for mode: ${mode}`);
  }
};
