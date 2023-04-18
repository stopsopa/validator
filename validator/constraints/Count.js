"use strict";

const isArray = require("../utils/isArray");

const isObject = require("../utils/isObject");

const Constraint = require("../prototypes/Constraint");

const def = {
  minMessage:
    "This collection should contain {{ limit }} element or more.|This collection should contain {{ limit }} elements or more.",
  maxMessage:
    "This collection should contain {{ limit }} element or less.|This collection should contain {{ limit }} elements or less.",
  exactMessage:
    "This collection should contain exactly {{ limit }} element.|This collection should contain exactly {{ limit }} elements.",
  // max,
  // min;
};

function Count() {
  let args = Array.prototype.slice.call(arguments);

  Constraint.apply(this, args); // call super constructor.

  if (args.length === 0) {
    throw new Error(`Count: options must be given for this constraint`);
  }

  let opt = args[0];

  this.setExtra(args[1]);

  if (Number.isInteger(opt)) {
    opt = {
      min: opt,
      max: opt,
    };
  }

  if (isObject(opt)) {
    opt = Object.assign({}, def, opt);
  } else {
    throw new Error(`Count: Wrong parameter type have been given to this constraint, typeof: ` + typeof opt);
  }

  if (typeof opt.min === "undefined" && typeof opt.max === "undefined") {
    throw new Error(`Count: Either option "min" or "max" must be given for constraint`);
  }

  if (typeof opt.min !== "undefined" && !Number.isInteger(opt.min)) {
    throw new Error(`Count: min should be integer`);
  }

  if (typeof opt.max !== "undefined" && !Number.isInteger(opt.max)) {
    throw new Error(`Count: max should be integer`);
  }

  if (opt.min < 0) {
    throw new Error(`Count: min should be greater than 0`);
  }

  if (opt.max < 0) {
    throw new Error(`Count: max should be greater than 0`);
  }

  this.setOptions(opt);
}

Count.prototype = Object.create(Constraint.prototype);
Count.prototype.constructor = Count;

Count.prototype.TOO_FEW_ERROR = "TOO_FEW_ERROR";
Count.prototype.TOO_MANY_ERROR = "TOO_MANY_ERROR";

Count.prototype.validate = function (value, context, path, extra) {
  const opt = this.getOptions();

  let count = false;

  if (isArray(value)) {
    count = value.length;
  }

  if (count === false && isObject(value)) {
    count = Object.keys(value).length;
  }

  if (count !== false) {
    if (typeof opt.max !== "undefined" && count > opt.max) {
      context
        .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage)
        .atPath(path)
        .setParameter("{{ count }}", count)
        .setParameter("{{ limit }}", opt.max)
        .setInvalidValue(value)
        .setPlural(opt.max === 1 ? 0 : 1)
        .setCode(Count.prototype.TOO_MANY_ERROR)
        .addViolation();

      if (extra && extra.stop) {
        return Promise.reject("stop Count");
      }

      return Promise.resolve("resolve Count");
    }

    if (typeof opt.min !== "undefined" && count < opt.min) {
      context
        .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage)
        .atPath(path)
        .setParameter("{{ count }}", count)
        .setParameter("{{ limit }}", opt.min)
        .setInvalidValue(value)
        .setPlural(opt.min === 1 ? 0 : 1)
        .setCode(Count.prototype.TOO_FEW_ERROR)
        .addViolation();

      if (extra && extra.stop) {
        return Promise.reject("stop Count");
      }

      return Promise.resolve("resolve Count");
    }
  }

  return Promise.resolve("Count");
};

module.exports = Count;
