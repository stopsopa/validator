"use strict";

try {
  require("karma_polyfill");
} catch (e) {}

const size = require("../../validator/utils/size");

it("size", () => {
  expect(size([])).toBe(0);
});

it("size array 0", () => {
  expect(size([])).toBe(0);
});

it("size array 2", () => {
  expect(size(["one", "two"])).toBe(2);
});

it("size empty object", () => {
  expect(size({})).toBe(0);
});

it("size no empty object", () => {
  expect(size({ a: "b" })).toBe(1);
});

it("size new Date()", () => {
  expect(size(new Date())).toBe(0);
});
