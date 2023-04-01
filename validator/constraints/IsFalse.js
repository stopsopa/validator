
'use strict';

const Constraint        = require('../prototypes/Constraint');



const def = {
    message    : 'This value should be false.',
};

const IsFalse = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

IsFalse.prototype = Object.create(Constraint.prototype);
IsFalse.prototype.constructor = IsFalse;

IsFalse.prototype.NOT_FALSE_ERROR = 'NOT_FALSE_ERROR';

IsFalse.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value !== false) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(IsFalse.prototype.NOT_FALSE_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop IsFalse');
        }
    }

    return Promise.resolve('resolve IsFalse');
};

module.exports = IsFalse;