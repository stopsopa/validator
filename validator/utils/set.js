
'use strict';

const isArray = require('./isArray');

const isObject = require('./isObject');

function set(source, key, value) {

    if (typeof key === 'string') {

        key = key.split('.');
    }

    if (typeof key === 'number') {

        key = key + '';
    }

    if ( isObject(key) ) {

        key = Object.values(key).map(a => a += '');
    }

    if (typeof key !== 'string' && ! key && key !== '0' && key !== '') {

        key = [];
    }

    if ( ! isArray(key) ) {

        key = [key];
    }

    if (key.length) {

        let first = true;

        let ar = isArray(source);

        if ( ! ar && ! isObject(source) ) {

            source = {};
        }

        let kt;

        let tmp     = source;

        let tmp2    = source;

        let obb, arr;

        while (key.length) {

            kt = key.shift();

            if (first) {

                first = false;

                if ( ar && !/^\d+$/.test(kt) && kt !== '') {

                    throw `if source is array and key is not integer nor empty string then its not possible to add to array, given key: ` + JSON.stringify(kt)
                }
            }

            tmp = tmp2;

            if ( key.length ) {

                obb = isObject(tmp[kt]);

                arr = isArray(tmp[kt]);

                if ( ! ( obb || arr ) ) {

                    if (key[0] === '') {

                        arr || (tmp[kt] = []);
                    }
                    else {

                        obb || (tmp[kt] = {});
                    }
                }

                tmp2 = tmp[kt];
            }
            else {

                if (isArray(tmp)) {

                    if (kt === '') {

                        tmp.push(value);
                    }
                    else {

                        tmp[kt] = value
                    }
                }
                else {

                    tmp[kt] = value;
                }

                return source;
            }
        }
    }

    return value;
}

module.exports = set;