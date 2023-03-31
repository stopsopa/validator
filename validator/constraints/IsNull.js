
'use strict';

const Constraint        = require('../prototypes/Constraint');

const ValidationStopError = require('../ValidationStopError');

const def = {
    message    : 'This value should be null.',
};

const IsNull = function (opt, extra) {

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

IsNull.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value !== null) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(IsNull.prototype.NOT_NULL_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject(new ValidationStopError('stop IsNull'));
        }
    }

    return Promise.resolve('resolve IsNull');
};

module.exports = IsNull;