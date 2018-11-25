
const isArray = require('./isArray');

module.exports = (a, b) => {

    if ( ! isArray(a) ) {

        return [];
    }

    if ( ! isArray(b) ) {

        return [];
    }

    return a.reduce((acc, val) => {

        if (b.indexOf(val) > -1) {

            acc.push(val);
        }

        return acc;
    }, []);
}