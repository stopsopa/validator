
'use strict';

const arrayIntersect    = require('../utils/arrayIntersect');

const isObject          = require('../utils/isObject');

const isArray           = require('../utils/isArray');

const Constraint        = require('../prototypes/Constraint');

const def = {
    message    : 'This value should not be blank.',
};

const Callback = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt !== 'function') {

        throw `Callback constraint first arg should be function`;
    }

    this.setOptions(opt);
}

Callback.prototype = Object.create(Constraint.prototype);

Callback.prototype.constructor = Callback;

Callback.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    return new Promise((resolve, reject) => {

        let result = opt(value, context, path, opt, extra);

        if ( ! result || typeof result.then !== 'function') {

            result = Promise.resolve();
        }

        result.then(resolve, reject)
    });
};

module.exports = Callback;