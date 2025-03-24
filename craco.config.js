const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
    webpack: {
        configure: (webpackConfig, { env }) => {
            const oneOfRule = webpackConfig.module.rules.find((rule) =>
                Array.isArray(rule.oneOf)
            ).oneOf;

            // Thay babel-loader bằng swc-loader
            for (let rule of oneOfRule) {
                if (rule.loader && rule.loader.includes("babel-loader")) {
                    rule.loader = require.resolve("swc-loader");
                    rule.options = {
                        jsc: {
                            parser: {
                                syntax: "typescript", // hoặc "ecmascript" nếu không dùng TS
                                tsx: true,
                                decorators: true,
                            },
                            transform: {
                                react: {
                                    runtime: "automatic",
                                },
                            },
                            target: "es2022", // build tối ưu hơn
                        },
                        sourceMaps: env === "development",
                    };
                }
            }

            // ⚙️ Production tối ưu
            if (env === "production") {
                webpackConfig.optimization = {
                    ...webpackConfig.optimization,
                    minimize: true,
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
                    ],
                    splitChunks: {
                        chunks: "all",
                        maxInitialRequests: 25,
                        maxAsyncRequests: 30,
                        cacheGroups: {
                            vendors: {
                                test: /[\\/]node_modules[\\/]/,
                                name: "vendors",
                                chunks: "all",
                            },
                            commons: {
                                name: "commons",
                                minChunks: 2,
                                priority: -10,
                                chunks: "initial",
                            },
                        },
                    },
                    runtimeChunk: {
                        name: (entrypoint) => `runtime-${entrypoint.name}`,
                    },
                };

                // 🧪 Bundle Analyzer
                webpackConfig.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: "static", // tạo file HTML
                        openAnalyzer: false, // không tự mở trình duyệt
                        reportFilename: "bundle-report.html",
                    })
                );
            }

            return webpackConfig;
        },
    },
};
