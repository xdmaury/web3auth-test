const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve } = require('path');
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack');

module.exports = (env, argv) => {
    const prod = argv.mode === 'production' ? 'prod' : 'dev';

    return {

        stats: {
            warningsFilter: [
                // Ignore warnings from ethers.js
                /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/
            ]
        },

        mode: prod === 'prod' ? 'production' : 'development',
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        entry: './src/index.tsx',
        output: {
            path: __dirname + '/dist/',
            filename: 'index_bundle.js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    resolve: {
                        extensions: ['.ts', '.tsx', '.js', '.json'],
                    },
                    use: 'ts-loader',
                },
                {
                    test: /\.css$/i, // (s(a|c)ss)?$
                    use: ['style-loader', 'css-loader', 'postcss-loader'], //MiniCssExtractPlugin.loader,  'sass-loader'
                },
                {
                    test: /environment\.ts?$/,
                    loader: 'file-replace-loader',
                    options: {
                        replacement: resolve(`./environments/environment.${prod}.ts`),
                    }
                },
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    enforce: 'pre',
                    loader: require.resolve('source-map-loader'),
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(jpe?g|gif|png|svg)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000
                            }
                        }
                    ]
                },
                {
                    test: /\.(webm|mp4)$/,
                    use: 'file-loader'
                }
            ]
        },
        devServer: {
            historyApiFallback: true,
            allowedHosts: 'all'
        },
        devtool: prod === 'prod' ? undefined : 'source-map',
        plugins: [
            new HtmlWebpackPlugin({
                template: 'index.html',
            }),
            new Dotenv(),
            new MiniCssExtractPlugin(),
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer']
            })
        ],
        resolve: {
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                assert: require.resolve('assert'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                os: require.resolve('os-browserify'),
                url: require.resolve('url'),
                "vm": false,
                "zlib": false,
            },
        },
        ignoreWarnings: [/Failed to parse source map/],
    };
};
