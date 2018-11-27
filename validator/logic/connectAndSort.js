
const Existence         = require('../prototypes/Existence');

const Constraint        = require('../prototypes/Constraint');

const isArray           = require('../utils/isArray');

const connectAndSort = function (value, constraints, context, path, final = false) {

    // process.stdout.write(`\n --connectAndSort-- \n`);

    if ( constraints instanceof Existence ) {

        // process.stdout.write(`\n ext out \n`);

        return connectAndSort(value, constraints.getOptions(), context, path, final);
    }

    if (constraints instanceof Constraint) {

        if ( ! isArray(constraints) ) {

            // process.stdout.write(`\n wrap in array \n`);

            constraints = [constraints];
        }
    }

    if ( ! isArray(constraints) ) {

        return;
    }


    for (let i = 0, l = constraints.length ; i < l ; i += 1 ) {

        // process.stdout.write(`\n loop ${i} \n`);

        if (constraints[i] instanceof Existence) {

            // process.stdout.write(`\n ext in \n`);

            connectAndSort(value, constraints[i].getOptions(), context, path)
        }
        else {

            // process.stdout.write(`\n validators \n`);

            if (constraints[i].validate) {

                context.addTrigger(
                    constraints[i].getOptions().async,
                    () => constraints[i].validate(value, context, path)
                );
            }

            if (constraints[i].validateChildren) {

                // process.stdout.write('test deep 1: ', JSON.stringify(constraints[i].getOptions().fields.b.getOptions()[0].getOptions(), null, 4));
                // process.stdout.write('test deep 2: ', JSON.stringify(constraints[i].getOptions(), null, 4));

                constraints[i].validateChildren(value, context, path);

                // value.forEach(value => {
                //
                //     (function (async, i, t) {
                //
                //         t = () => constraints[i].validateChildren(value, context);
                //
                //         t.toString = t.toJSON = () => `validate:${async}`;
                //
                //         context.addTrigger(async, t)
                //
                //     }(constraints[i].getOptions().async, i));
                // })
            }
        }

    }

    if (final) {

        // process.stdout.write(`\n final \n`);

        return context.getTriggers();
    }
}

module.exports = connectAndSort;