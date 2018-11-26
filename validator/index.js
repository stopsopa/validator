
const isArray = require('./utils/isArray');

const Context = require('./logic/Context');

const connectAndSort = require('./logic/connectAndSort');

const Constraint        = require('./prototypes/Constraint');

const Existence        = require('./prototypes/Existence');

const Required      = require('./constraints/Required');

/**
 * import validator, { test } from '@stopsopa/validator';
 *
 * @param data
 * @param constraints
 * @param options
 * @returns {string}
 */

const validator = (value, constraints, extra) => {

    // constraints = constraints.validateChildren();

    const context       = new Context(value, extra);

    const connected     = connectAndSort(value, constraints, context, true);

    // console.log(`\n+\n`+JSON.stringify(connected)+`\n++++\n\n`);

    let promise = Promise.resolve();

    // console.log(`\n\n\ni before: `+connected.length+`\n\n`);

    while (connected.length) {

        // console.log(`\n\n\ni: `+connected.length+`\n\n`);

        // connected.shift();

        // return Promise.all(connected.shift());

        (function (list) {

            // console.log('l: ' + l)

            promise = promise.then(() => Promise.all(list.map(c => c())));

        }(connected.shift()))

    }

    return promise.then(data => {

        // if (extra && extra.debug) {
        //
        //     console.log('validate.then: ', data);
        // }

        return context.getViolations();
    });
}

module.exports  = validator;
