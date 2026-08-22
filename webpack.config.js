const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: isProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].js",
      chunkFilename: isProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      publicPath: "/",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      modules: ["node_modules", path.resolve(__dirname, "src")],
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
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
          type: "asset/resource",
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
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
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
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        "process.env.PUBLIC_URL": JSON.stringify(""),
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      isProduction &&
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "bundle-report.html",
        }),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: true,
            mangle: true,
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: "antd",
            priority: 20,
            chunks: "all",
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            chunks: "all",
          },
          commons: {
            name: "commons",
            minChunks: 2,
            priority: -10,
            chunks: "initial",
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      open: false,
      static: {
        directory: path.join(__dirname, "public"),
      },
      client: {
        overlay: true,
      },
    },
  };
};
