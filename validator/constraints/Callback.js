
'use strict';

const Constraint        = require('../prototypes/Constraint');

const Callback = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt !== 'function') {

        throw new Error(`Callback constraint first arg should be function`);
    }

    this.setOptions(opt);
}

Callback.prototype = Object.create(Constraint.prototype);

Callback.prototype.constructor = Callback;

Callback.prototype.validate = function (value, context, path, extra) {

    const callback = this.getOptions();

    return Promise.resolve(callback(value, context, path, extra));
};

module.exports = Callback;