
const isArray           = require('./utils/isArray');

const Context           = require('./logic/Context');

const connectAndSort    = require('./logic/connectAndSort');

const Constraint        = require('./prototypes/Constraint');

const Existence         = require('./prototypes/Existence');

const Required          = require('./constraints/Required');

const delay             = require('./utils/delay');

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
                //
                //     console.log(`\n\n\n\n\n`);
                //     log.dump('resolved:', a);
                //     console.log(`\n\n\n\n\n`);
                //
                //     return a;
                // }, a => {
                //
                //     console.log(`\n\n\n\n\n`);
                //     log.dump('rejected:', a);
                //     console.log(`\n\n\n\n\n`);
                //     return a;
                // })
            ;

        }(connected.shift()));
    }

    return promise.then(() => context.getViolations());
}

module.exports  = validator;
