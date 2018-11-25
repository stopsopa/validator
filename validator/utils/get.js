
const isArray   = require('./isArray');

/**
 *
 * @param source
 * @param key
 * @param jsonIfNotString - for grabbing errors mode - get all but serialized you can then
 * query again with more direct path
 * @returns {*}
 */
const get = function (source, key) {

    // log('key', key);
    // log('source', source)

    if ( ! key ) {

        return source;
    }

    if (typeof key === 'string' && key.indexOf('.') > -1) {

        key = key.split('.');
    }

    if ( ! isArray(key)) {

        key = [key];
    }

    let tmp = source, k;

    while (k = key.shift()) {

        if (typeof tmp[k] === 'undefined') {

            return arguments[2];
        }
        else {

            if (key.length) {

                tmp = tmp[k];
            }
            else {

                return tmp[k];
            }
        }
    }
}

module.exports = get;