
'use strict';

const Constraint        = require('../prototypes/Constraint');

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

    const callback = this.getOptions();

    return new Promise((resolve, reject) => {

        let result = callback(value, context, path, extra);

        if ( ! result || typeof result.then !== 'function') {

            result = Promise.resolve();
        }

        result.then(resolve, reject)
    });
};

module.exports = Callback;