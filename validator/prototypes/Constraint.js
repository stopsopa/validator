
const Constraint = function () {

    if ( ! (this instanceof Constraint) )
        throw `Don't use ${this.cls}() as a function, create instance new ${this.cls}()`;

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

    // if (this.cls) {
    //
    //     console.log(JSON.stringify({
    //         get: this.cls,
    //         data: this.opt,
    //     }, null, 4))
    // }

    return this.opt;
}
Constraint.prototype.setOptions = function (opt) {

    this.opt = opt;

    // if (this.cls) {
    //
    //     console.log(JSON.stringify({
    //         setcls: this,
    //     }, null, 4));
    // }

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
Constraint.prototype.validateChildren = false

// Constraint.prototype.toJSON = function () {
//
//     const obj = Object.assign({}, this);
//
//     delete obj.opt;
//
//     return obj;
// }

module.exports = Constraint;