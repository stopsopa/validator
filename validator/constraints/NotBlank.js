
'use strict';

const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const isArray           = require('../utils/isArray');

const Constraint        = require('../prototypes/Constraint');

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

    let valid = true;

    switch (true) {
        case (!value): // covers: false, null, undefined, '', 0, NaN
        case (value === '0'): // covers: '0'
        case (isArray(value) && value.length === 0):
        case (isObject(value) && Object.keys(value).length === 0):
            valid = false;
            break;
    }

    if ( ! valid ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(NotBlank.prototype.IS_BLANK_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra.stop) {

            return Promise.reject('stop NotBlank');
        }
    }

    return Promise.resolve('resolve NotBlank');
};

module.exports = NotBlank;