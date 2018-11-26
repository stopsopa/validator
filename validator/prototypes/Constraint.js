
const Constraint = function (opt) {

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

module.exports = Constraint;