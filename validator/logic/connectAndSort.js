
const Existence         = require('../prototypes/Existence');

const isArray           = require('../utils/isArray');

const connectAndSort = function (value, constraints, context) {

    if ( constraints instanceof Existence ) {

        throw `connectAndSort(): Validator shouldn't be at this stage of type 'Existence'`;
    }

    if ( ! isArray(constraints) ) {

        constraints = [constraints];
    }

    for (let i = 0, l = constraints.length ; i < l ; i += 1 ) {

        (function (async, i, t) {

            t = () => constraints[i].validate(value, context);

            t.toString = t.toJSON = () => `+${async}+`;

            context.addTrigger(async, t)

        }(constraints[i].getOptions().async, i));
    }

    return context.getTriggers();
}

module.exports = connectAndSort;