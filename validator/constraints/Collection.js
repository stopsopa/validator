
const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Constraint         = require('../prototypes/Constraint');

const def = {
    fields                  : [],
    allowExtraFields        : false,
    allowMissingFields      : false,
    extraFieldsMessage      : 'This field was not expected.',
    missingFieldsMessage    : 'This field is missing.',
};

const Collection = function (opt) {

    if (isObject(opt)) {

        if ( arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0 ) {

            opt = Object.assign(def, {
                fileds  : opt,
            });
        }
    }
    else {

        opt = Object.assign({}, def);
    }
}

Collection.prototype = Object.create(Constraint.prototype);
Collection.prototype.constructor = Collection;

Collection.prototype.MISSING_FIELD_ERROR = 'MISSING_FIELD_ERROR';
Collection.prototype.NO_SUCH_FIELD_ERROR = 'NO_SUCH_FIELD_ERROR';

module.exports = Collection;