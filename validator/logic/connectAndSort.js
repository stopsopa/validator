
const Existence         = require('../prototypes/Existence');

const Constraint        = require('../prototypes/Constraint');

const isArray           = require('../utils/isArray');

const connectAndSort = function (value, constraints, context, final = false) {

    if ( constraints instanceof Existence ) {

        throw `connectAndSort(): Validator shouldn't be at this stage of type 'Existence'(Require or Optional), specify rather regular array of multiple validators`;
    }

    if ( constraints instanceof Constraint) {

        if ( ! isArray(constraints) ) {

            constraints = [constraints];
        }
    }

    if ( ! isArray(constraints) ) {

        return;
    }

    for (let i = 0, l = constraints.length ; i < l ; i += 1 ) {

        if (constraints[i] instanceof Existence) {

            continue;
        }

        try {

            if (constraints[i].validate) {

                (function (async, i, t) {

                    t = () => constraints[i].validate(value, context);

                    t.toString = t.toJSON = () => `validate:${async}`;

                    context.addTrigger(async, t)

                }(constraints[i].getOptions().async, i));
            }
        }
        catch (e) {

            console.log(e + '')
            console.log(`\n\n\n\n\n`+JSON.stringify(constraints, null, 4)+`\n\n\n\n`);
        }

        if (constraints[i].validateChildren) {

            // console.log('test deep 1: ', JSON.stringify(constraints[i].getOptions().fields.b.getOptions()[0].getOptions(), null, 4));
            // console.log('test deep 2: ', JSON.stringify(constraints[i].getOptions(), null, 4));

            constraints[i].validateChildren(value, context);

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

    if (final) {

        return context.getTriggers();
    }
}

module.exports = connectAndSort;