
const Constraint = require('./Constraint');

const Existence = function () {

};

Existence.prototype = Object.create(Constraint.prototype);
Existence.prototype.constructor = Existence;

module.exports = Existence;