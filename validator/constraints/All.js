"use strict";

const Constraint = require("../prototypes/Constraint");

const All = function (opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  this.setOptions(opt);
};

All.prototype = Object.create(Constraint.prototype);
All.prototype.constructor = All;

module.exports = All;
