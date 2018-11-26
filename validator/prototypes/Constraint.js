
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
Constraint.prototype.collectionValidator = false;

Constraint.prototype.getOptions = function () {
    return this._opt || {};
}
Constraint.prototype.setOptions = function (opt) {
    // console.log(`\n\n\n\n`+JSON.stringify(opt, null, 4)+`\n\n\n`);
    this._opt = opt;
    return this;
}

Constraint.prototype.setExtra = function (extra) {
    this._extra = extra;
    return this;
}
Constraint.prototype.getExtra = function () {
    return this._extra;
}

Constraint.prototype.getChildren = function () {
    return [];
}

module.exports = Constraint;