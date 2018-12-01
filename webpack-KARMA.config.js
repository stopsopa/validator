'use strict';

const path                  = require('path');

const webpack               = require('webpack');

const utils                 = require('./webpack/utils');

utils.setup(path.resolve(__dirname, 'webpack', 'config.js'));

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: utils.entries(),
    output: {
        path: utils.config.js.outputForWeb,
        filename: "[name].test.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-env',
                        ],
                        plugins: [
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-async-generator-functions',
                            '@babel/plugin-transform-async-to-generator',
                            '@babel/plugin-transform-destructuring',
                        ],
                        sourceMap: false,
                    }
                }
            },
        ]
    },
    resolve: {
        alias: {
            karma_polyfill: path.resolve(__dirname, 'webpack', 'karma-polyfill'),
        }
    },
    plugins: [
        new webpack.ProvidePlugin(utils.config.provide)
    ],
    optimization:{
        // minimize: false, // <---- disables uglify.
        // minimizer: [new UglifyJsPlugin()] if you want to customize it.
    }
};