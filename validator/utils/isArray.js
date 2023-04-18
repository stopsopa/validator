"use strict";

function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

module.exports = isArray;
