const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: true,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
  devServer: {
    port: process.env.PORT || 3000,
    historyApiFallback: true,
    hot: true,
    open: false,
    static: {
      directory: path.join(__dirname, "../public"),
    },
    client: {
      overlay: true,
    },
  },
};
