
'use strict';

const isObject          = require('../utils/isObject');

const isArray           = require('../utils/isArray');

const Constraint        = require('../prototypes/Constraint');

const def = {
    message    : `This value should be of type '{{ type }}'.`,
};

const Type = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (isArray(opt)) {

        opt = {
            type: opt,
        }
    }

    if (typeof opt === 'string') {

        opt = {
            type: opt,
        }
    }

    opt = Object.assign({}, def, opt);

    if ( ! isArray(opt.type) ) {

        opt.type = [opt.type];
    }

    for (let i = 0, l = opt.type.length ; i < l ; i += 1 ) {

        if (typeof opt.type[i] === 'string') {

            opt.type[i] = opt.type[i].toLowerCase();
        }
        else {

            throw `Type constraint: Each of types have to be string one of: ` + Type.prototype.allowedTypes.map(a => `"${a}"`).join(', ');
        }

        if (Type.prototype.allowedTypes.indexOf(opt.type[i]) === -1) {

            throw `Type constraint: One of types is string but is not one of: ` + Type.prototype.allowedTypes.map(a => `"${a}"`).join(', ');
        }
    }

    this.setOptions(opt);
}

Type.prototype = Object.create(Constraint.prototype);

Type.prototype.constructor = Type;

Type.prototype.INVALID_TYPE_ERROR = 'INVALID_TYPE_ERROR';

Type.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if ( ! Type.prototype.logic(value, opt.type) ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            .setParameter('{{ type }}', opt.type.join(', '))
            .setCode(Type.prototype.INVALID_TYPE_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            // return reject('stop Type');
            return Promise.reject('stop Type');
        }
    }

    return Promise.resolve('resolve Type');
};

Type.prototype.logic = function (value, type) {

    let valid = false;

    let arr = isArray(value);

    let obj = isObject(value);

    let t;

    for (let i = 0, l = type.length ; i < l ; i += 1 ) {

        t = type[i];

        if (t === 'int') {

            t = 'integer';
        }

        if (t === 'bool') {

            t = 'boolean';
        }

        if (t === 'array' && arr && !obj) {

            valid = true;
            break;
        }

        if (t === 'object' && !arr && obj) {

            valid = true;
            break;
        }

        if (t === 'integer' && Number.isInteger(value)) {

            valid = true;
            break;
        }

        if ( ! obj && ! arr && typeof value === t) {

            valid = true;
            break;
        }
    }

    return valid;
}

Type.prototype.allowedTypes = 'undefined object boolean bool number string symbol function integer int array'.split(' ');

module.exports = Type;