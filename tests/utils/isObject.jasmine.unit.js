"use strict";



const isObject = require("../../validator/utils/isObject");

it("isObject()", () => {
  expect(isObject()).toBe(false);
});
it("isObject({})", () => {
  expect(isObject({})).toBe(true);
});

it("isObject([]) - ! special case", () => {
  expect(isObject([])).toBe(false);
});

it("isObject(new Date)", () => {
  expect(isObject(new Date())).toBe(false);
});
