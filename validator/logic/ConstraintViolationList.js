"use strict";

const set = require("../utils/set");

const isArray = require("../utils/isArray");

/**
 * https://stackoverflow.com/a/14438954
 */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function ConstraintViolationList(violations) {
  this.violations = violations;
}

ConstraintViolationList.prototype.getRaw = function () {
  return this.violations.map((v) => {
    if (v.length > 4) {
      v.pop();
    }
    return v;
  });
};

ConstraintViolationList.prototype.getFlat = function (all = false) {
  let key;

  const list = this.violations.reduce((acc, v) => {
    key = v[0] || "";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(v);

    return acc;
  }, {});

  return Object.keys(list).reduce((acc, key) => {
    acc[key] = list[key];

    acc[key].sort(function (aa, bb, a = 0, b = 0) {
      if (typeof aa[4] === "number") {
        a = aa[4];
      } else if (aa[4] && typeof aa[4].order !== "undefined") {
        a = aa[4].order;
      }

      if (typeof bb[4] === "number") {
        b = bb[4];
      } else if (bb[4] && typeof bb[4].order !== "undefined") {
        b = bb[4].order;
      }

      return b - a;
    });

    acc[key] = acc[key].map((v) => v[1]);

    if (!all) {
      acc[key] = acc[key].shift();
    }

    return acc;
  }, {});
};

ConstraintViolationList.prototype.getTree = function (all = false) {
  const raw = this.getFlat(all);

  return Object.keys(raw).reduce((acc, key) => {
    acc = set(acc, key, raw[key]);

    return acc;
  }, {});
};

ConstraintViolationList.prototype.findByCodes = function (codes) {
  if (!isArray(codes)) {
    codes = [codes];
  }

  codes = codes.filter(onlyUnique);

  let tmp = [];

  for (let i = 0, l = codes.length; i < l; i += 1) {
    tmp = tmp.concat(this.violations.filter((v) => v[2] === codes[i]));
  }

  return tmp;
};
ConstraintViolationList.prototype.count = function () {
  return this.violations.length;
};

module.exports = ConstraintViolationList;
