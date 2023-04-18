"use strict";

try {
  require("karma_polyfill");
} catch (e) {}

const each = require("../../validator/utils/each");

it("each() - array stop", (done) => {
  const a = "qwertyuiop".split("");

  const t = [];

  each(a, (a) => {
    t.push(a);
    if (a === "t") {
      return false;
    }
  });

  expect(t.join("")).toBe("qwert");

  done();
});

it("each() - object stop", (done) => {
  const a = "qwertyuiop".split("");

  const b = a.reduce((acc, val) => {
    acc[val] = val;
    return acc;
  }, {});

  const t = [];

  each(b, (a) => {
    t.push(a);
    if (a === "y") {
      return false;
    }
  });

  expect(t.join("")).toBe("qwerty");

  done();
});

it("each() - hasOwnProperty (else case) part 1", (done) => {
  function abs() {}

  function ext() {
    this.test = "abs";
    this.two = "ext";
  }

  ext.prototype = Object.create(abs.prototype);
  ext.prototype.constructor = abs;

  var k = new ext();

  const t = [];

  each(k, (a) => {
    t.push(a);
  });

  expect(t.join(" ")).toBe("abs ext");

  done();
});

it("each() - hasOwnProperty (else case) part 2", (done) => {
  function abs() {
    this.test = "abs";
  }

  function ext() {
    this.two = "ext";
  }

  ext.prototype = Object.create(abs.prototype);
  ext.prototype.constructor = abs;

  var k = new ext();

  const t = [];

  each(k, (a) => {
    t.push(a);
  });

  expect(t.join("")).toBe("ext");

  done();
});
