'use strict';

const path                  = require('path');

const dev =              require('./webpack.config');

dev.entry = {
    spvalidation: path.resolve(__dirname, 'validator', 'index')
}

dev.output = {
    library: 'spvalidation',
    libraryTarget: 'umd',
    filename: 'spvalidation.js',
    // auxiliaryComment: 'Test Comment'
}

const prod = Object.assign({}, dev, {
    mode: 'production',
    output: Object.assign({}, dev.output, {
        filename: 'spvalidation.min.js',
    })
});

module.exports = [dev, prod];

// const sp = spvalidation;
//
// sp({
//     test: null,
// }, new sp.Collection({
//     test: new sp.NotBlank()
// }))
// .then(errors => errors.getTree(true))
// .then(errors => console.log(errors))