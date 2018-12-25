'use strict';

const path                  = require('path');

let dev                     = require('./webpack-KARMA.config');

dev = Object.assign(dev,{
    mode: 'production',
})

dev.entry = {
    spvalidation: path.resolve(__dirname, 'validator', 'index')
}

dev.output = {
    library: 'spvalidation',
    libraryTarget: 'umd',
    filename: 'spvalidation.js',
    // pathinfo: true,
//     auxiliaryComment: {
//         root: `
// /**
//  * @author Szymon Działowski
//  * @homepage https://github.com/stopsopa/validator
//  */
//     `
//     }
    // auxiliaryComment: 'Test Comment'
}

const prod = Object.assign({}, dev, {
    output: Object.assign({}, dev.output, {
        filename: 'spvalidation.min.js',
    })
});

dev = Object.assign({}, dev, {
    optimization:{
        minimize: false,
    }
})

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