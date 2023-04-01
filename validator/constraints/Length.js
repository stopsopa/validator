
'use strict';

const isObject          = require('../utils/isObject');

const Constraint        = require('../prototypes/Constraint');



const def = {
    maxMessage: 'This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.',
    minMessage: 'This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.',
    exactMessage: 'This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.',
    // max,
    // min;
};

function Length() {

    let args = Array.prototype.slice.call(arguments);

    Constraint.apply(this, args); // call super constructor.

    if ( args.length === 0) {

        throw `Length: options must be given for this constraint`;
    }

    let opt = args[0];

    this.setExtra(args[1]);

    if (Number.isInteger(opt)) {

        opt = {
            min: opt,
            max: opt,
        }
    }

    if (isObject(opt)) {

        opt = Object.assign({}, def, opt);
    }
    else {

        throw `Length: Wrong parameter type have been given to this constraint, typeof: ` + (typeof opt);
    }

    if ( typeof opt.min === 'undefined' && typeof opt.max === 'undefined') {

        throw `Length: Either option "min" or "max" must be given for constraint`;
    }

    this.setOptions(opt);
}

Length.prototype = Object.create(Constraint.prototype);
Length.prototype.constructor = Length;

Length.prototype.TOO_SHORT_ERROR            = 'TOO_SHORT_ERROR';
Length.prototype.TOO_LONG_ERROR             = 'TOO_LONG_ERROR';

Length.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (typeof value === 'string') {

        const length = value.length;

        if (typeof opt.max !== 'undefined' && length > opt.max) {

            context
                .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage)
                .atPath(path)
                .setPlural( (opt.max === 1) ? 0 : 1 )
                .setParameter('{{ value }}', value)
                .setParameter('{{ limit }}', opt.max)
                .setInvalidValue(value)
                .setCode(Length.prototype.TOO_LONG_ERROR)
                .setExtra(extra)
                .addViolation()
            ;

            if (extra && extra.stop) {

                return Promise.reject('stop Length');
            }

            return Promise.resolve('resolve Length');
        }

        if (typeof opt.min !== 'undefined' && length < opt.min) {

            context
                .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage)
                .atPath(path)
                .setPlural( (opt.min === 1) ? 0 : 1 )
                .setParameter('{{ value }}', value)
                .setParameter('{{ limit }}', opt.min)
                .setInvalidValue(value)
                .setCode(Length.prototype.TOO_SHORT_ERROR)
                .setExtra(extra)
                .addViolation()
            ;

            if (extra && extra.stop) {

                return Promise.reject('stop Length');
            }

            return Promise.resolve('resolve Length');
        }
    }

    return Promise.resolve('Length');
}

module.exports = Length;