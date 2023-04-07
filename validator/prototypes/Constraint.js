
'use strict';

const isObject = require('../utils/isObject');

function Constraint() {

    if ( ! (this instanceof Constraint) ) {

        throw new Error(`It is necessary to use operator 'new' with all constraints`)
    }
};

const sufix         = '_ERROR';

const sufix_length  = sufix.length;

Constraint.prototype.errorNames = function () {

    if ( ! Constraint.prototype._errorNames ) {

        Constraint.prototype._errorNames = Object.keys(this.constructor.prototype).reduce((acc, key) => {

            const val = this.constructor.prototype[key];

            if (
                typeof val === 'string'
                && key === key.toUpperCase()
                && key.substring(key.length - sufix_length) === sufix
            ) {
                acc[key] = key;
            }

            return acc;
        }, {});
    }

    return Constraint.prototype._errorNames;
}

Constraint.prototype.getOptions = function () {

    return this.opt;
}
Constraint.prototype.setOptions = function (opt) {

    this.opt = opt;

    return this;
}

Constraint.prototype.setExtra = function (extra) {

    this.extra = extra;

    return this;
}
Constraint.prototype.getExtra = function () {

    return this.extra;
}

// Constraint.prototype.validate = function (value, context) {}
Constraint.prototype.validate = false;

// Constraint.prototype.validateChildren = function (value, context) {}
Constraint.prototype.validateChildren = false;

module.exports = Constraint;