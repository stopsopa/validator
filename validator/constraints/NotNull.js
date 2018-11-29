
'use strict';

const Constraint        = require('../prototypes/Constraint');

const def = {
    message    : 'his value should be true.',
};

const NotNull = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

NotNull.prototype = Object.create(Constraint.prototype);
NotNull.prototype.constructor = NotNull;

NotNull.prototype.IS_NULL_ERROR = 'IS_NULL_ERROR';

NotNull.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value !== true) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(NotNull.prototype.IS_NULL_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra.stop) {

            // return reject('stop Type');
            return Promise.reject('stop NotNull');
        }
    }

    return Promise.resolve('resolve NotNull');
};

module.exports = NotNull;