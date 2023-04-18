"use strict";

const isObject = require("../utils/isObject");

const isArray = require("../utils/isArray");

const Constraint = require("../prototypes/Constraint");

const def = {
  message: "This value should be blank.",
};

const Blank = function (opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === "string") {
    opt = {
      message: opt,
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

Blank.prototype = Object.create(Constraint.prototype);

Blank.prototype.constructor = Blank;

Blank.prototype.NOT_BLANK_ERROR = "NOT_BLANK_ERROR";

Blank.prototype.validate = function (value, context, path, extra) {
  const opt = this.getOptions();

  let blank = Blank.prototype.logic(value);

  if (!blank) {
    context
      .buildViolation(opt.message)
      .atPath(path)
      // .setParameter('{{ value }}', $this->formatValue($value))
      .setCode(Blank.prototype.NOT_BLANK_ERROR)
      .setInvalidValue(value)
      .addViolation();

    if (extra && extra.stop) {
      return Promise.reject("stop Blank");
    }
  }

  return Promise.resolve("resolve Blank");
};

Blank.prototype.logic = function (value) {
  let blank = false;

  switch (true) {
    case !value: // covers: false, null, undefined, '', 0, NaN
    case value === "0": // covers: '0'
    case isArray(value) && value.length === 0:
    case isObject(value) && Object.keys(value).length === 0:
      blank = true;
      break;
  }

  return blank;
};

module.exports = Blank;
