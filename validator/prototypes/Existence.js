"use strict";

const Constraint = require("./Constraint");

const Existence = function () {
  Constraint.apply(this, arguments); // call super constructor.
};

Existence.prototype = Object.create(Constraint.prototype);
Existence.prototype.constructor = Existence;

module.exports = Existence;
