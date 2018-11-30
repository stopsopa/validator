
'use strict';

const set       = require('../utils/set');

const isArray   = require('../utils/isArray');

/**
 * https://stackoverflow.com/a/14438954
 */
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function ConstraintViolationList (violations) {

    this.violations = violations || [];
}

ConstraintViolationList.prototype.getRaw = function () {
    return this.violations;
}

ConstraintViolationList.prototype.getFlat = function () {

    let key;

    return this.violations.reduce((acc, v) => {

        key = v[0] || '';

        if ( ! acc[key] ) {

            acc[key] = [];
        }

        acc[key].push(v[1]);

        return acc;
    }, {});
}

ConstraintViolationList.prototype.getTree = function () {

    let key = {};

    return this.violations.reduce((acc, v) => {

        key = v[0] || '';

        acc = set(acc, key += '.', v[1]);

        // if ( ! acc[key] ) {
        //
        //     acc[key] = [];
        // }
        //
        // acc[key].push(v[1]);

        return acc;
    }, {});
}

ConstraintViolationList.prototype.findByCodes = function (codes) {

    if ( ! isArray(codes) ) {

        codes = [codes]
    }

    codes = codes.filter(onlyUnique);

    let tmp = [];

    for (let i = 0, l = codes.length ; i < l ; i += 1 ) {

        tmp = tmp.concat(this.violations.filter(v => v[2] === codes[i]) || []);
    }

    return tmp;
}
ConstraintViolationList.prototype.count = function () {
    return this.violations.length;
}

module.exports = ConstraintViolationList;