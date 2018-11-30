
'use strict';

const Existence         = require('../prototypes/Existence');

const Constraint        = require('../prototypes/Constraint');

const All               = require('../constraints/All');

const isArray           = require('../utils/isArray');

const each              = require('../utils/each');

const connectAndSort = function (value, constraints, context, path, final = false) {

    if ( constraints instanceof Existence ) {

        return connectAndSort(value, constraints.getOptions(), context, path, final);
    }

    if (constraints instanceof Constraint) {

        if ( ! isArray(constraints) ) {

            constraints = [constraints];
        }
    }

    if ( ! isArray(constraints) ) {

        if (final) {

            return context.getTriggers();
        }

        return;
    }

    let extra;

    for (let i = 0, l = constraints.length ; i < l ; i += 1 ) {

        if (constraints[i] instanceof Existence) {

            connectAndSort(value, constraints[i].getOptions(), context, path)
        }
        else if (constraints[i] instanceof All) {

            const combine = (typeof path === 'undefined') ? name => name : name => path + '.' + name;

            const allConstraints = constraints[i].getOptions();

            each(value, (v, name) => {

                connectAndSort(v, allConstraints, context, combine(name));
            });
        }
        else {

            extra = constraints[i].getExtra();

            if (constraints[i].validate) {

                context.addTrigger(
                    extra.async,
                    () => constraints[i].validate(
                        value,
                        context,
                        path,
                        extra
                    )
                );
            }

            if (constraints[i].validateChildren) {

                constraints[i].validateChildren(value, context, path, extra);
            }
        }
    }

    if (final) {

        return context.getTriggers();
    }
}

module.exports = connectAndSort;