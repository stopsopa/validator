
'use strict';

const Context           = require('./logic/Context');

const connectAndSort    = require('./logic/connectAndSort');

const delay             = require('./utils/delay');

const promiseall        = require('nlab/promiseall');

// const log               = require('../log/logn');

/**
 * import validator, { test } from '@stopsopa/validator';
 *
 * @param data
 * @param constraints
 * @param options
 * @returns {string}
 */

const validator = (value, constraints, extra, debug) => {

    const context       = new Context(value, extra);

    const connected     = connectAndSort({
        value,
        constraints,
        context,
        path: extra ? extra.path : undefined,
        final: true
    });

    let promise = Promise.resolve();

    while (connected.length) {

        (function (list) {

            promise = promise
                .then(() => promiseall(list.map(c => c())))
            ;

            if (debug > 1) {

                promise = promise
                    .then(...delay.then(2500))
                ;
            }

            if (debug > 0) {

                promise = promise
                    .then(a => {
                        console.log('debug resolved:', JSON.stringify(a));
                        return a;
                    }, a => {
                        console.log('debug rejected:', JSON.stringify(a));
                        return a;
                    })
                ;
            }

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
validator.Choice        = require('./constraints/Choice');
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
