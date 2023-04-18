
'use strict';

const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Constraint        = require('../prototypes/Constraint');

const Existence         = require('../prototypes/Existence');

const Required          = require('../constraints/Required');

const Optional          = require('../constraints/Optional');

const connectAndSort    = require('../logic/connectAndSort');

const isArray           = require('../utils/isArray');

const each              = require('../utils/each');

const def = {
    fields                  : {},
    allowExtraFields        : false,
    allowMissingFields      : false,
    extraFieldsMessage      : 'This field was not expected.',
    missingFieldsMessage    : 'This field is missing.',
};

const Collection = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if ( ! isObject(opt) || opt instanceof Constraint) {

        throw new Error(`Collection accept only plain object as a first argument`);
    }

    if (isObject(opt) && arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0) {

        opt = Object.assign({}, def, {
            fields  : opt,
        });
    }
    else {

        opt = Object.assign({}, def, opt);
    }

    if ( Object.keys(opt.fields).length === 0) {

        throw new Error(`Describe at least one field in "fields" parameter`);
    }

    opt.fields = Object.keys(opt.fields).reduce((acc, field) => {

        if ( opt.fields[field] instanceof Existence ) {

            acc[field] = opt.fields[field];
        }
        else {

            acc[field] = new Required(opt.fields[field]);
        }

        return acc;
    }, {});

    this.setOptions(opt);
}

Collection.prototype = Object.create(Constraint.prototype);
Collection.prototype.constructor = Collection;

Collection.prototype.MISSING_FIELD_ERROR = 'MISSING_FIELD_ERROR';
Collection.prototype.NO_SUCH_FIELD_ERROR = 'NO_SUCH_FIELD_ERROR';

Collection.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (isObject(value) || isArray(value)) {

        Object.keys(opt.fields).forEach(field => {

            if (typeof value[field] === 'undefined') {

                if ( ! (opt.fields[field] instanceof Optional) && ! opt.allowMissingFields) {

                    context
                        .buildViolation(opt.missingFieldsMessage)
                        .atPath((typeof path === 'undefined') ? field : ( path + '.' + field))
                        .setParameter('{{ field }}', field)
                        .setCode(Collection.prototype.MISSING_FIELD_ERROR)
                        .setInvalidValue(value)
                        .addViolation()
                    ;
                }
            }
        });

        if ( ! opt.allowExtraFields ) {

            each(value, (_, field) => {

                if (typeof opt.fields[field] === 'undefined') {

                    context
                        .buildViolation(opt.extraFieldsMessage)
                        .atPath((typeof path === 'undefined') ? field : ( path + '.' + field))
                        .setParameter('{{ field }}', field)
                        .setCode(Collection.prototype.NO_SUCH_FIELD_ERROR)
                        .setInvalidValue(value)
                        .addViolation()
                    ;
                }
            });
        }
    }

    return Promise.resolve('resolve Collection2');
};

Collection.prototype.validateChildren = function (value, context, path, extra) {

    const opt = this.getOptions();

    let tmp;

    each(value,(_, name) => {

        if (tmp = opt.fields[name]) {

            connectAndSort({
                value: value[name],
                constraints: tmp.getOptions(),
                context,
                path: path ? (path + '.' + name) : name,
            });
        }
    });
}

module.exports = Collection;