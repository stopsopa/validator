
'use strict';

const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const isArray           = require('../utils/isArray');

const Constraint        = require('../prototypes/Constraint');

const def = {
    message    : `This value should be of type '{{ type }}'.`,
};

const Type = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            type: opt,
        }
    }

    opt = Object.assign({}, def, opt);

    if (typeof opt.type !== 'string') {

        throw `Type constraint: type parameter have to be string and one of: ` + Type.prototype.allowedTypes.map(a => `"${a}"`).join(', ');
    }

    if (Type.prototype.allowedTypes.indexOf(opt.type) === -1) {

        throw `Type constraint: type parameter is string but is not one of: ` + Type.prototype.allowedTypes.map(a => `"${a}"`).join(', ');
    }

    this.setOptions(opt);
}

Type.prototype = Object.create(Constraint.prototype);

Type.prototype.constructor = Type;

Type.prototype.INVALID_TYPE_ERROR = 'INVALID_TYPE_ERROR';

Type.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    // return new Promise((resolve, reject) => {
    //
    //     setTimeout(() => {

            let type = opt.type;

            // console.log('type', type, extra.async)

            type = type.toLowerCase();

            let valid = false;

            let arr = isArray(value);

            let obj = isObject(value);

            if (type === 'array' && arr) {

                valid = true;
            }
            else if (type === 'object' && obj) {

                valid = true;
            }
            else if (type === 'integer' && Number.isInteger(value)) {

                valid = true;
            }
            else if ( ! obj && ! arr && typeof value === type) {

                valid = true;
            }

            if ( ! valid ) {

                context
                    .buildViolation(opt.message)
                    .atPath(path)
                    .setParameter('{{ type }}', opt.type)
                    .setCode(Type.prototype.INVALID_TYPE_ERROR)
                    .setInvalidValue(value)
                    .addViolation()
                ;

                if (extra.stop) {

                    // return reject('stop Type');
                    return Promise.reject('stop Type');
                }
            }

            // return resolve('resolve Type');
            return Promise.resolve('resolve Type');

    //     }, 1500);
    // })
};

Type.prototype.allowedTypes = 'undefined object boolean number string symbol function integer array'.split(' ');

module.exports = Type;