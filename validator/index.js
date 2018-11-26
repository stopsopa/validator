
const isArray = require('./utils/isArray');

const Context = require('./logic/Context');

/**
 * import validator, { test } from '@stopsopa/validator';
 *
 * @param data
 * @param constraints
 * @param options
 * @returns {string}
 */

const validator = (value, constraints, options) => {

    if ( ! isArray(constraints) ) {

        constraints = [constraints];
    }

    const context = new Context();

    return Promise.all(constraints.map(c => c.validate(value, context)))
        .then(() => context.getViolations())
    ;
}

module.exports  = validator;
