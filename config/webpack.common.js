const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

dotenv.config();

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    modules: [path.resolve(__dirname, "../src"), "node_modules"],
    alias: {
      src: path.resolve(__dirname, "../src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: true,
                dynamicImport: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
              target: "es2022",
            },
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: "static/media/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[hash:8][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.PUBLIC_URL": JSON.stringify(""),
      "process.env.REACT_APP_DOMAIN": JSON.stringify(
        process.env.REACT_APP_DOMAIN || "https://movienew.cybersoft.edu.vn"
      ),
      "process.env.REACT_APP_TOKEN_CYBERSOFT": JSON.stringify(
        process.env.REACT_APP_TOKEN_CYBERSOFT || ""
      ),
      "process.env.REACT_APP_GROUP_ID": JSON.stringify(
        process.env.REACT_APP_GROUP_ID || "GP01"
      ),
    }),
  ],
};
