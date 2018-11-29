
'use strict';

const Constraint        = require('../prototypes/Constraint');

const def = {
    message    : 'his value should be true.',
};

const IsTrue = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

IsTrue.prototype = Object.create(Constraint.prototype);
IsTrue.prototype.constructor = IsTrue;

IsTrue.prototype.NOT_TRUE_ERROR = 'NOT_TRUE_ERROR';

IsTrue.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value !== true) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(IsTrue.prototype.NOT_TRUE_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;
    }

    return extra.stop ? Promise.reject('stop IsTrue') : Promise.resolve('resolve IsTrue');
};

module.exports = IsTrue;