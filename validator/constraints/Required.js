
const Existence         = require('../prototypes/Existence');

const Constraint         = require('../prototypes/Constraint');

const Required = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    this.setOptions(opt);
}

Required.prototype = Object.create(Existence.prototype);
Required.prototype.constructor = Required;

module.exports = Required;