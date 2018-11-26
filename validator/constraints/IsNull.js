
const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Constraint        = require('../prototypes/Constraint');

const Context           = require('../logic/Context');

const def = {
    message    : 'This value should be null.',
};

const IsNull = function (opt) {

    if (isObject(opt)) {

        if ( arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0 ) {

            opt = Object.assign(def, {
                fileds  : opt,
            });
        }
    }
    else {

        opt = Object.assign({}, def);
    }

    this._opt = opt;
}

IsNull.prototype = Object.create(Constraint.prototype);
IsNull.prototype.constructor = IsNull;

IsNull.prototype.NOT_NULL_ERROR = 'NOT_NULL_ERROR';

IsNull.prototype.validate = function (value, context) {

    const opt = this._opt;

    if (value !== null) {

        context
            .buildViolation(opt.message)
            .atPath(null)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(IsNull.prototype.NOT_NULL_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;
    }

    return Promise.resolve();
};

module.exports = IsNull;