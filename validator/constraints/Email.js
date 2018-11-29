
'use strict';

const Constraint        = require('../prototypes/Constraint');

const def = {
    message    : 'This value is not a valid email address.',
};

const Email = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

Email.prototype = Object.create(Constraint.prototype);
Email.prototype.constructor = Email;

Email.prototype.INVALID_EMAIL_ERROR = 'INVALID_EMAIL_ERROR';

Email.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if ( ! Email.prototype.validEmail(value) ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(Email.prototype.INVALID_EMAIL_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra.stop) {

            return Promise.reject('stop Email');
        }
    }

    return Promise.resolve('resolve Email');
};

Email.prototype.validEmail = function (email) {

    if (typeof email === 'string') {

        return /^.+\@\S+\.\S+$/.test(email);
    }

    return false;
}

module.exports = Email;