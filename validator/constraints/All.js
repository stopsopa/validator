
const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Constraint        = require('../prototypes/Constraint');

const All = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.cls = 'All';

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(opt || []);
}

All.prototype = Object.create(Constraint.prototype);
All.prototype.constructor = All;

All.prototype.collectionValidator = true;

All.prototype.validate = function (value, context) {

    const opt = this.getOptions();

    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if (value !== null) {

                context
                    .buildViolation(opt.message)
                    .atPath(null)
                    // .setParameter('{{ value }}', $this->formatValue($value))
                    .setCode(All.prototype.NOT_NULL_ERROR)
                    .setInvalidValue(value)
                    .addViolation()
                ;
            }

            // reject('reject');
            resolve('All');
        }, 1000);
    });
};

module.exports = All;