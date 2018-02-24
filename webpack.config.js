"use strict";

const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const config = require('./assets/config.json');

// https://webpack.js.org/guides/production/
// https://medium.com/netscape/webpack-3-react-production-build-tips-d20507dba99a

const webpackConfig = {
    devtool: 'inline-source-map',
    entry: [
        './assets/scripts/custom/app.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), // the target directory for all output - files must be an absolute path
        filename: 'bundle.js', // the filename template for entry chunks - https://webpack.js.org/configuration/output/#output-filename
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
                                require('lost'),
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
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
    },
    plugins: [
        //new webpack.LoaderOptionsPlugin({
            //debug: true
        //}),
        new ExtractTextPlugin({
            disable: false,
            filename: 'styles.css',
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoEmitOnErrorsPlugin(),
        new BrowserSyncPlugin({
            proxy: config.proxyUrl,
            files: [
                '**/*.php'
            ],
            reloadDelay: 0
        })
    ]
};

//process.env.NODE_ENV = 'production';
// webpack --progress --define process.env.NODE_ENV="'production'"

if ( process.env.NODE_ENV === 'production' ) {
    const buildFolder = path.resolve( __dirname, 'buildProd' );

    webpackConfig.devtool = 'cheap-module-source-map';

    webpackConfig.plugins.push( new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }));

    /*webpackConfig.plugins.push( new webpack.optimize.ModuleConcatenationPlugin() );
    webpackConfig.plugins.push( new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.[chunk].js',
        minChunks(module) {
            return module.context && module.context.indexOf('node_modules') >= 0;
        }
    }));*/

    webpackConfig.plugins.push( new webpack.optimize.UglifyJsPlugin({
        'mangle': {
            'screw_ie8': true
        },
        'compress': {
            'screw_ie8': true,
            'warnings': false
        },
        'output': {
            'comments': false
        },
        sourceMap: true
    }));

    //webpackConfig.plugins.push( new webpack.HashedModuleIdsPlugin() );

    // Clean out the current contents of our build folder
    webpackConfig.plugins.push( new CleanWebpackPlugin( [buildFolder] ) );

    webpackConfig.plugins.push(
        new CopyWebpackPlugin( [
            //{ from: path.resolve( __dirname, 'server' ) + '/**', to: buildFolder },
            //{ from: path.resolve( __dirname, '../../../*.php' ), to: buildFolder },
            //{ from: path.resolve( __dirname, '*.php' ), to: buildFolder }
        ], {

            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
        } )
    );

    webpackConfig.output.path = buildFolder + '/dist';
}

module.exports = webpackConfig;