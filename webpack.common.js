"use strict";

const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');

const config = require('./assets/config.json');

module.exports = {
    entry: {
        //hot: 'webpack-hot-middleware/client?reload=true',
        app: './assets/scripts/custom/app.js',
        appStyle: './assets/sass/style.scss'
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin( ['dist'] ),
        /*new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),*/
        /*new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),*/
        new ExtractTextPlugin({
            disable: false,
            //filename: '[name].[contentHash].css',
            filename: '[name].min.css',
            allChunks: true
        }),
        //new webpack.HotModuleReplacementPlugin(),
        new StyleExtHtmlWebpackPlugin({
            minify: true
        }),
        new BrowserSyncPlugin({
            //proxy: config.proxyUrl,
            proxy: config.devUrl,
            files: [
                '**/*.php'
            ],
            reloadDelay: 0
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), // the target directory for all output - files must be an absolute path
        filename: '[name].bundle.js', // the filename template for entry chunks - https://webpack.js.org/configuration/output/#output-filename
        publicPath: '/' // // the url to the output directory resolved relative to the HTML page
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                //include: path.resolve(__dirname, 'assets/scripts/custom'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.hbs$/,
                use: [{
                    loader: 'handlebars-loader'
                }]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true,
                            plugins: () => ([
                                require('autoprefixer')({
                                    browsers: ['last 2 versions', 'ie > 8']
                                })
                            ])
                        }
                    }
                ]
            },
            {
                test: /\.(sass|scss)$/,
                // .extract( options - { fallback, use* }
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: () => ([
                                    require('autoprefixer')({
                                        browsers: ['last 2 versions', 'ie > 8']
                                    })
                                ])
                            }
                        },
                        {
                            loader: 'resolve-url-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg|ico)$/,
                //include: config.paths.assets,
                loader: 'url-loader',
                options: {
                    limit: 48096,
                    name: `[path][name].[ext]`
                }
            }
        ]
    }
};