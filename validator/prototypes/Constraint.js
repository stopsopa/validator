
'use strict';

function Constraint() {

    if ( ! (this instanceof Constraint) ) {

        // https://stackoverflow.com/a/27462108
        let name = 'UnknownConstraintsClass';

        try {
            const tmp = Error().stack.split(/\n/g).filter(a => /^\s*at /.test(a));
            // console.log(tmp.map((a, i) => i + ':' + a).join("\n\n"));
            name = tmp[1].replace(/.*\/([^\/]+)\.js.*/, '$1')
        }
        catch (e) {}

        throw `Don't use ${name}() as a function, create instance new ${name}()`;
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