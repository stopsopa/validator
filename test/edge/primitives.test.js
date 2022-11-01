"use strict";

const validator = require("../../validator");

const Email = require("../../validator/constraints/Email");

const Count = require("../../validator/constraints/Count");
const Length = require("../../validator/constraints/Length");

const Collection = require("../../validator/constraints/Collection");

const { Required, Type, Optional } = require("../../validator");

describe("main level req/opt unspecified", () => {
  it("001  - normal", (done) => {
    (async function () {
      const errors = await validator("test", new Type("str"));

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("002  - normal", (done) => {
    (async function () {
      const errors = await validator(6, new Type("str"));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("002 null  - normal", (done) => {
    (async function () {
      const errors = await validator(null, new Type("str"));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", null]]);

      done();
    })();
  });

  it("002 undefined  - normal", (done) => {
    (async function () {
      const errors = await validator(undefined, new Type("str"));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", undefined]]);

      done();
    })();
  });
});

describe("main level wrapped with opt", () => {
  it("003  - normal", (done) => {
    (async function () {
      const errors = await validator("test", new Optional(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("004  - normal", (done) => {
    (async function () {
      const errors = await validator(6, new Optional(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("004 null - normal", (done) => {
    (async function () {
      const errors = await validator(null, new Optional(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", null]]);

      done();
    })();
  });

  it("004 undefined - normal", (done) => {
    (async function () {
      const errors = await validator(undefined, new Optional(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", undefined]]);

      done();
    })();
  });
});
describe("main level wrapped with req", () => {
  it("005  - normal", (done) => {
    (async function () {
      const errors = await validator("test", new Required(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("006  - normal", (done) => {
    (async function () {
      const errors = await validator(6, new Required(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("006 null - normal", (done) => {
    (async function () {
      const errors = await validator(null, new Required(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", null]]);

      done();
    })();
  });

  it("006 undefined - normal", (done) => {
    (async function () {
      const errors = await validator(undefined, new Required(new Type("str")));

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'str'.", "INVALID_TYPE_ERROR", undefined]]);

      done();
    })();
  });
});
