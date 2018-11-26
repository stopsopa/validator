
const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const Existence         = require('../prototypes/Existence');

const def = {
    fields                  : [],
    allowExtraFields        : false,
    allowMissingFields      : false,
    extraFieldsMessage      : 'This field was not expected.',
    missingFieldsMessage    : 'This field is missing.',
};

const Optional = function (opt) {

    if (isObject(opt)) {

        if ( arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0 ) {

            opt = Object.assign({}, def, {
                fileds  : opt,
            });
        }
    }
    else {

        opt = Object.assign({}, def);
    }



}
Optional.prototype = Object.create(Existence.prototype);
Optional.prototype.constructor = Optional;

// Collection.MISSING_FIELD_ERROR = '2fa2158c-2a7f-484b-98aa-975522539ff8';
// Collection.NO_SUCH_FIELD_ERROR = '7703c766-b5d5-4cef-ace7-ae0dd82304e9';
//
// Collection.errorNames = {
//     MISSING_FIELD_ERROR: 'MISSING_FIELD_ERROR',
//     NO_SUCH_FIELD_ERROR: 'NO_SUCH_FIELD_ERROR',
// };

module.exports = Optional;