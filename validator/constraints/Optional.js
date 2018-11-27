
const Existence         = require('../prototypes/Existence');

const Constraint         = require('../prototypes/Constraint');

const Optional = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.cls = 'Optional';

    this.setExtra(extra);

    this.setOptions(opt);
}

Optional.prototype = Object.create(Existence.prototype);
Optional.prototype.constructor = Optional;

// Optional.prototype.validate = function (value, context) {
//     return Promise.resolve('Optional');
// }

module.exports = Optional;