
'use strict';

const Constraint        = require('../prototypes/Constraint');

const isObject          = require('../utils/isObject');

const def = {
    message     : 'This value is not valid.',
    match       : true
};

const Regex = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (Regex.prototype.isRegex(opt)) {

        opt = {
            pattern: opt,
        }
    }

    if ( ! isObject(opt) ) {

        throw `Regex: first argument must be regex or object`;
    }

    if ( ! Regex.prototype.isRegex(opt.pattern) ) {

        throw `Regex: 'pattern' is not specified`;
    }

    this.setOptions(Object.assign({}, def, opt));
}

Regex.prototype = Object.create(Constraint.prototype);
Regex.prototype.constructor = Regex;

Regex.prototype.REGEX_FAILED_ERROR = 'REGEX_FAILED_ERROR';

Regex.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if ( ! Regex.prototype.logic(value, opt.pattern, opt.match) ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(Regex.prototype.REGEX_FAILED_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop Regex');
        }
    }

    return Promise.resolve('resolve Regex');
};
Regex.prototype.isRegex = function (reg) {
    return Object.prototype.toString.call(reg) === "[object RegExp]"
}
Regex.prototype.logic = function (value, regex, match) {

    value += ''; // to make it works on value given by any type, It is good idea to use Type constraint before Regex

    const ret = regex.test(value);

    return match ? ret : !ret;
}

module.exports = Regex;