
const isArray = require('./isArray');

const isObject = require('./isObject');

module.exports = obj => {

    if (isArray(obj)) {

        return obj.length;
    }

    if (isObject(obj)) {

        return Object.keys(obj).length;
    }

    return 0;
}