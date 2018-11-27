
const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Constraint        = require('../prototypes/Constraint');

const def = {
    message    : 'This value should be null.',
};

const IsNull = function (opt, extra) {

    this.cls = 'IsNull';

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

IsNull.prototype = Object.create(Constraint.prototype);
IsNull.prototype.constructor = IsNull;

IsNull.prototype.NOT_NULL_ERROR = 'NOT_NULL_ERROR';

IsNull.prototype.validate = function (value, context, path) {

    const opt = this.getOptions();

    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if (value !== null) {

                context
                    .buildViolation(opt.message)
                    .atPath(path)
                    // .setParameter('{{ value }}', $this->formatValue($value))
                    .setCode(IsNull.prototype.NOT_NULL_ERROR)
                    .setInvalidValue(value)
                    .addViolation()
                ;
            }

            // reject('reject');
            resolve('IsNull');
        }, 1000);
    });
};

module.exports = IsNull;