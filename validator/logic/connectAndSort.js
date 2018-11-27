
const Existence         = require('../prototypes/Existence');

const Constraint        = require('../prototypes/Constraint');

const All               = require('../constraints/All');

const isArray           = require('../utils/isArray');

const each              = require('../utils/each');

const connectAndSort = function (value, constraints, context, path, final = false) {

    process.stdout.write(`\n --connectAndSort-- \n`);

    if ( constraints instanceof Existence ) {

        process.stdout.write(`\n ext out \n`);

        return connectAndSort(value, constraints.getOptions(), context, path, final);
    }

    if (constraints instanceof Constraint) {

        if ( ! isArray(constraints) ) {

            process.stdout.write(`\n wrap in array \n`);

            constraints = [constraints];
        }
    }

    if ( ! isArray(constraints) ) {

        if (final) {

            process.stdout.write(`\n final 1 \n`);

            return context.getTriggers();
        }

        return;
    }

    for (let i = 0, l = constraints.length ; i < l ; i += 1 ) {

        process.stdout.write(`\n loop ${i} \n`);

        if (constraints[i] instanceof Existence) {

            process.stdout.write(`\n ext in \n`);

            connectAndSort(value, constraints[i].getOptions(), context, path)
        }
        else if (constraints[i] instanceof All) {

            const combine = (typeof path === 'undefined') ? name => name : name => path + '.' + name;

            process.stdout.write(`\n all ${JSON.stringify(value, null, 4)} \n`);

            const allConstraints = constraints[i].getOptions();

            each(value, (v, name) => {

                process.stdout.write(`\n each '${name}' -> '${combine(name)}'\n`);

                connectAndSort(v, allConstraints, context, combine(name));
            });
        }
        else {

            process.stdout.write(`\n validators \n`);

            if (constraints[i].validate) {

                context.addTrigger(
                    constraints[i].getOptions().async,
                    () => constraints[i].validate(value, context, path)
                );
            }

            if (constraints[i].validateChildren) {

                constraints[i].validateChildren(value, context, path);
            }
        }
    }

    if (final) {

        process.stdout.write(`\n final 2 \n`);

        return context.getTriggers();
    }
}

module.exports = connectAndSort;