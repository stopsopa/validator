'use strict';

const path                  = require('path');

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: {
        examples: path.resolve(__dirname, 'examples.es6.js'),
    },
    output: {
        path: __dirname,
        filename: 'examples.es5.js',
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
    optimization:{
        minimize: false,
    },
    performance: {
        hints: false
    }
};