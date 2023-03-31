
'use strict';

const Constraint        = require('../prototypes/Constraint');

const Blank             = require('./Blank');

const ValidationStopError = require('../ValidationStopError');

const def = {
    message    : 'This value should not be blank.',
};

const NotBlank = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

NotBlank.prototype = Object.create(Constraint.prototype);

NotBlank.prototype.constructor = NotBlank;

NotBlank.prototype.IS_BLANK_ERROR = 'IS_BLANK_ERROR';

NotBlank.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    let blank = Blank.prototype.logic(value);

    if ( blank ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(NotBlank.prototype.IS_BLANK_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject(new ValidationStopError('stop NotBlank'));
        }
    }

    return Promise.resolve('resolve NotBlank');
};

module.exports = NotBlank;