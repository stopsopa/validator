"use strict";

try {
  require("karma_polyfill");
} catch (e) {}

const validator = require("../../validator");

const Blank = require("../../validator/constraints/Blank");

const Count = require("../../validator/constraints/Count");

const Collection = require("../../validator/constraints/Collection");

it("Blank", () => {
  var k = new Blank();

  expect(k.errorNames()).toEqual({
    NOT_BLANK_ERROR: Blank.prototype.NOT_BLANK_ERROR,
  });
});

it("Blank() - used as a function", (done) => {
  try {
    validator(
      "test",
      new Collection({
        test: Blank(),
      })
    );
  } catch (e) {
    expect(String(e)).toBe("Error: It is necessary to use operator 'new' with all constraints");

    done();
  }
});

it("Blank - custom message", (done) => {
  validator("test", new Blank("custom message")).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "custom message", "NOT_BLANK_ERROR", "test"]]);

      done();
    },
    (e) => done({ e })
  );
});
it("Blank - stop [part 1]", (done) => {
  validator(
    {
      z: "string",
      b: {
        a: {
          a: "b",
          c: "d",
          d: "f",
        },
      },
    },
    new Collection({
      z: new Blank(),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["z", "This value should be blank.", "NOT_BLANK_ERROR", "string"],
        [
          "b.a",
          "This collection should contain exactly 2 elements.",
          "TOO_MANY_ERROR",
          {
            a: "b",
            c: "d",
            d: "f",
          },
        ],
      ]);

      done();
    },
    (e) => done({ e })
  );
});
it("Blank - stop [part 2]", (done) => {
  validator(
    {
      z: "0d",
      b: {
        a: {
          a: "b",
          c: "d",
          d: "f",
        },
      },
    },
    new Collection({
      z: new Blank(null, { async: -1, stop: true }),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["z", "This value should be blank.", "NOT_BLANK_ERROR", "0d"]]);

      done();
    },
    (e) => done({ e })
  );
});
it("Blank - not empty array", (done) => {
  validator(
    {
      z: ["test"],
    },
    new Collection({
      z: new Blank(),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["z", "This value should be blank.", "NOT_BLANK_ERROR", ["test"]]]);

      done();
    },
    (e) => done({ e })
  );
});
it("Blank - not empty object", (done) => {
  validator(
    {
      z: { test: "test" },
    },
    new Collection({
      z: new Blank(),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["z", "This value should be blank.", "NOT_BLANK_ERROR", { test: "test" }]]);

      done();
    },
    (e) => done({ e })
  );
});

it("Blank - blank", (done) => {
  validator(
    {
      z: null,
    },
    new Collection({
      z: new Blank(),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});
