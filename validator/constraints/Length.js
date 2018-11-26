
const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Constraint        = require('../prototypes/Constraint');

const def = {
    maxMessage: 'This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.',
    minMessage: 'This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.',
    exactMessage: 'This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.',
    charsetMessage: 'This value does not match the expected {{ charset }} charset.',
    // max,
    // min;
    // charset = 'UTF-8';
};

const Length = function () {

    this.cls = 'Length';

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

Length.prototype.validate = function (value, context) {

    const opt = this.getOptions();

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if (typeof value !== 'string') {

                return resolve('Length');
            }

            const length = value.length;

            if (typeof opt.max !== 'undefined' && length > opt.max) {

                context
                    .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage)
                    .atPath(null)
                    .setParameter('{{ value }}', value)
                    .setParameter('{{ limit }}', opt.max)
                    .setInvalidValue(value)
                    .setCode(Length.prototype.TOO_LONG_ERROR)
                    .addViolation()
                ;

                return resolve('Length');
            }

            if (typeof opt.min !== 'undefined' && length < opt.min) {

                context
                    .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage)
                    .atPath(null)
                    .setParameter('{{ value }}', value)
                    .setParameter('{{ limit }}', opt.min)
                    .setInvalidValue(value)
                    .setCode(Length.prototype.TOO_SHORT_ERROR)
                    .addViolation()
                ;

                return resolve('Length');
            }

            return resolve('Length');
        }, 1000);

    });
}

module.exports = Length;