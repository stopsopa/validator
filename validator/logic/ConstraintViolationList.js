
const set = require('../utils/set');

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

module.exports = ConstraintViolationList;