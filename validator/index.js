
'use strict';

const Context           = require('./logic/Context');

const connectAndSort    = require('./logic/connectAndSort');

// const delay             = require('./utils/delay');

// const log               = require('../log/logn');

/**
 * import validator, { test } from '@stopsopa/validator';
 *
 * @param data
 * @param constraints
 * @param options
 * @returns {string}
 */

const validator = (value, constraints, extra) => {

    const context       = new Context(value, extra);

    const connected     = connectAndSort(value, constraints, context, extra ? extra.path : undefined, true);

    let promise = Promise.resolve();

    while (connected.length) {

        (function (list) {

            promise = promise
                .then(() => Promise.all(list.map(c => c())))
                // .then(...delay.then(2500))
                // .then(a => {
                //     console.log(`\n\n\n\n\n`);
                //     console.log('resolved:', JSON.stringify(a+''));
                //     console.log(`\n\n\n\n\n`);
                //     return a;
                // }, a => {
                //     console.log(`\n\n\n\n\n`);
                //     console.log('rejected:', JSON.stringify(a+''));
                //     console.log(`\n\n\n\n\n`);
                //     return a;
                // })
            ;

        }(connected.shift()));
    }

    const end = () => context.getViolations();

    return promise.then(end, end);
}

validator.Required      = require('./constraints/Required');
validator.Optional      = require('./constraints/Optional');
validator.Collection    = require('./constraints/Collection');
validator.All           = require('./constraints/All');
validator.Blank         = require('./constraints/Blank');
validator.Callback      = require('./constraints/Callback');
validator.Count         = require('./constraints/Count');
validator.Email         = require('./constraints/Email');
validator.IsFalse       = require('./constraints/IsFalse');
validator.IsNull        = require('./constraints/IsNull');
validator.IsTrue        = require('./constraints/IsTrue');
validator.Length        = require('./constraints/Length');
validator.NotBlank      = require('./constraints/NotBlank');
validator.NotNull       = require('./constraints/NotNull');
validator.Regex         = require('./constraints/Regex');
validator.Type          = require('./constraints/Type');

module.exports  = validator;
