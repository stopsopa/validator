"use strict";



const set = require("../../validator/utils/set");

it("set() - key null", (done) => {
  let target = {};

  target = set(target, null, "test");

  expect(target).toBe("test");

  done();
});

it("set() - key undefined", (done) => {
  let target = {};

  target = set(target, undefined, "test");

  expect(target).toBe("test");

  done();
});

it("set() - key false", (done) => {
  let target = {};

  target = set(target, false, "test");

  expect(target).toBe("test");

  done();
});

it("set() - key true", (done) => {
  let target = {};

  target = set(target, false, "test");

  expect(target).toBe("test");

  done();
});

it("set() - key int 0", (done) => {
  let target = {};

  target = set(target, 0, "test");

  expect(target).toEqual({ 0: "test" });

  done();
});

it("set() - key int 1", (done) => {
  let target = {};

  target = set(target, 1, "test");

  expect(target).toEqual({ 1: "test" });

  done();
});

it("set() - key object empty", (done) => {
  let target = {};

  target = set(target, {}, "test");

  expect(target).toBe("test");

  done();
});

it("set() - key object a b", (done) => {
  let target = {};

  target = set(target, { a: "b", c: "d" }, "test");

  expect(target).toEqual({ b: { d: "test" } });

  done();
});

it("set() - key object a b c", (done) => {
  let target = {};

  target = set(target, { a: "b", c: "d", e: "ff" }, "test");

  expect(target).toEqual({ b: { d: { ff: "test" } } });

  done();
});

it("set() - key object a b c - not empty source", (done) => {
  let target = {
    g: { h: "i" },
  };

  target = set(target, { a: "b", c: "d", e: "ff" }, "test");

  expect(target).toEqual({ b: { d: { ff: "test" } }, g: { h: "i" } });

  done();
});

it("set() - key array a b c - not empty source", (done) => {
  let target = {
    g: { h: "i" },
  };

  target = set(target, ["b", "d", "ff"], "test");

  expect(target).toEqual({ b: { d: { ff: "test" } }, g: { h: "i" } });

  done();
});

it("set() - key array false - not empty source", (done) => {
  let target = [];

  target = set(target, false, "test");

  expect(target).toEqual("test");

  done();
});

it("set() - not empty array - key 0", (done) => {
  let target = ["one"];

  target = set(target, 0, "test");

  expect(target).toEqual(["test"]);

  done();
});

it("set() - not empty array - key 1", (done) => {
  let target = ["one"];

  target = set(target, 1, "test");

  expect(target).toEqual(["one", "test"]);

  done();
});

it("set() - not empty array - key 4", (done) => {
  let target = ["one"];

  target = set(target, 4, "test");

  expect(target).toEqual(["one", undefined, undefined, undefined, "test"]);

  done();
});

it("set() - not empty array - key l4 [expected error]", (done) => {
  let target = ["one"];

  try {
    target = set(target, "l4", "test");
  } catch (e) {
    expect(String(e)).toEqual(
      `Error: if source is array and key is not integer nor empty string then its not possible to add to array, given key: "l4"`
    );

    done();
  }
});

it("set() - false - key 4", (done) => {
  let target = false;

  target = set(target, 4, "test");

  expect(target).toEqual({ 4: "test" });

  done();
});

it('set() - [] - key ""', (done) => {
  let target = [];

  target = set(target, "", "test");

  expect(target).toEqual(["test"]);

  done();
});

it("set() - {} - key a.", (done) => {
  let target = {};

  target = set(target, "a.", "test");

  expect(target).toEqual({ a: ["test"] });

  done();
});

it("set() - {} - key a. x2", (done) => {
  let target = {};

  target = set(target, "a.", "test");

  target = set(target, "a.", "end");

  expect(target).toEqual({ a: ["test", "end"] });

  done();
});

it("set() - {} - key a.b.", (done) => {
  let target = {};

  target = set(target, "a.b.", "test");

  target = set(target, "a.b.", "end");

  expect(target).toEqual({ a: { b: ["test", "end"] } });

  done();
});

it("set() - {} - key a.b.", (done) => {
  let target = {};

  target = set(target, "a.b.", "test");

  target = set(target, "a.b.1", "end");

  expect(target).toEqual({ a: { b: ["test", "end"] } });

  done();
});

it("set() - {} - key a.b.", (done) => {
  let target = {};

  target = set(target, "a.b.c.", "test");

  target = set(target, "a.b.d.", "end");

  expect(target).toEqual({ a: { b: { c: ["test"], d: ["end"] } } });

  done();
});

it("set() - complex", (done) => {
  let target = {};

  target = set(target, "one.", "two");
  target = set(target, "one.", "two2");

  target = set(target, "three.", "four");
  target = set(target, "three.", "four2");

  target = set(target, "six.seven.", "eight");
  target = set(target, "six.seven.", "eight2");

  target = set(target, "nine.ten.eleven.", "twelve");
  target = set(target, "nine.ten.eleven.", "twelve2");

  // console.log(JSON.stringify(target, null, 4));

  expect(target).toEqual({
    one: ["two", "two2"],
    three: ["four", "four2"],
    six: {
      seven: ["eight", "eight2"],
    },
    nine: {
      ten: {
        eleven: ["twelve", "twelve2"],
      },
    },
  });

  done();
});

it("set() - complex reverse", (done) => {
  let target = {};

  target = set(target, "nine.ten.eleven.", "twelve");
  target = set(target, "nine.ten.eleven.", "twelve2");

  target = set(target, "six.seven.", "eight");
  target = set(target, "six.seven.", "eight2");

  target = set(target, "three.", "four");
  target = set(target, "three.", "four2");

  target = set(target, "one.", "two");
  target = set(target, "one.", "two2");

  // console.log(JSON.stringify(target, null, 4));

  expect(target).toEqual({
    nine: {
      ten: {
        eleven: ["twelve", "twelve2"],
      },
    },
    six: {
      seven: ["eight", "eight2"],
    },
    three: ["four", "four2"],
    one: ["two", "two2"],
  });

  done();
});
