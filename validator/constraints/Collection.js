
const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Constraint        = require('../prototypes/Constraint');

const Existence         = require('../prototypes/Existence');

const IsNull            = require('../constraints/IsNull');

const Required          = require('../constraints/Required');

const Optional          = require('../constraints/Optional');

const def = {
    fields                  : [],
    allowExtraFields        : false,
    allowMissingFields      : false,
    extraFieldsMessage      : 'This field was not expected.',
    missingFieldsMessage    : 'This field is missing.',
};

const Collection = function (opt, extra) {

    this.cls = 'Collection';

    this.setExtra(extra);

    if (isObject(opt)) {

        if ( arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0 ) {

            opt = Object.assign(def, {
                fields  : opt,
            });
        }
    }
    else {

        opt = Object.assign({}, def);
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



    console.log(`\n\n\n\n\n\n\n\n\nCollection construct: `+JSON.stringify(opt, null, 4)+`\n\n\n\n\n\n\n`);

    this.setOptions(opt);
}

Collection.prototype = Object.create(Constraint.prototype);
Collection.prototype.constructor = Collection;

Collection.prototype.MISSING_FIELD_ERROR = 'MISSING_FIELD_ERROR';
Collection.prototype.NO_SUCH_FIELD_ERROR = 'NO_SUCH_FIELD_ERROR';

Collection.prototype.validate = function (value, context) {

    const opt = this.getOptions();

    console.log(`\n\n\n\n\n\n\n\n\nopt: `+JSON.stringify(opt, null, 4)+`\n\n\n\n\n\n\n`);

    // return Promise.resolve()


    return new Promise((resolve, reject) => {
        setTimeout(() => {

            // console.log(`\n\n\n\n\n\ncon: `+JSON.stringify(opt.fields, null, 4)+`\n\n\n\n\n`);
            // process.exit(1);

            const optFieldsIsObj    = isObject(value);

            const keys              = optFieldsIsObj ? Object.keys(value) : [];

            if ( ! value ) {

                if ( ! opt.allowMissingFields ) {

                    keys.forEach(field => {

                        context
                            .buildViolation(opt.missingFieldsMessage)
                            .atPath(field)
                            .setParameter('{{ field }}', field)
                            .setCode(Collection.prototype.MISSING_FIELD_ERROR)
                            .setInvalidValue(value)
                            .addViolation()
                        ;
                    });
                }

                return resolve('Collection 1');
            }

            if (optFieldsIsObj) {

                Object.keys(opt.fields).forEach(field => {

                    if (typeof value[field] === 'undefined') {

                        if ( ! (opt.fields[field] instanceof Optional) && ! opt.allowMissingFields) {

                            context
                                .buildViolation(opt.missingFieldsMessage)
                                .atPath(field)
                                .setParameter('{{ field }}', field)
                                .setCode(Collection.prototype.MISSING_FIELD_ERROR)
                                .setInvalidValue(value)
                                .addViolation()
                            ;
                        }
                    }
                    else {

                        /**
                         * Make nested validation
                         */
                    }
                });

                if ( ! opt.allowExtraFields ) {

                    keys.forEach(field => {

                        if (typeof opt.fields[field] === 'undefined') {

                            context
                                .buildViolation(opt.extraFieldsMessage)
                                .atPath(field)
                                .setParameter('{{ field }}', field)
                                .setCode(Collection.prototype.NO_SUCH_FIELD_ERROR)
                                .setInvalidValue(value)
                                .addViolation()
                            ;
                        }
                    });
                }
            }

            resolve('Collection 2');
        }, 1000);
    });
};

Collection.prototype.getChildren = function () {

    return this.getOptions().fields || [];
}

module.exports = Collection;