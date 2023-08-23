"use strict";



const validator = require("../../validator");

const IsNull = require("../../validator/constraints/IsNull");

const Count = require("../../validator/constraints/Count");

const Collection = require("../../validator/constraints/Collection");

it("IsNull", () => {
  var k = new IsNull();

  expect(k.errorNames()).toEqual({
    NOT_NULL_ERROR: IsNull.prototype.NOT_NULL_ERROR,
  });
});

it("IsNull() - used as a function", (done) => {
  try {
    validator(
      "test",
      new Collection({
        test: IsNull(),
      })
    );
  } catch (e) {
    expect(String(e)).toBe("Error: It is necessary to use operator 'new' with all constraints");

    done();
  }
});

it("IsNull - is actually null", (done) => {
  validator(null, new IsNull()).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("IsNull - custom message", (done) => {
  validator("test", new IsNull("custom message")).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "custom message", "NOT_NULL_ERROR", "test"]]);

      done();
    },
    (e) => done({ e })
  );
});

it("IsNull - stop [part 1]", (done) => {
  validator(
    {
      z: false,
      b: {
        a: {
          a: "b",
          c: "d",
          d: "f",
        },
      },
    },
    new Collection({
      z: new IsNull(),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["z", "This value should be null.", "NOT_NULL_ERROR", false],
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
it("IsNull - stop [part 2]", (done) => {
  validator(
    {
      z: false,
      b: {
        a: {
          a: "b",
          c: "d",
          d: "f",
        },
      },
    },
    new Collection({
      z: new IsNull(undefined, { async: -1, stop: true }),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["z", "This value should be null.", "NOT_NULL_ERROR", false]]);

      done();
    },
    (e) => done({ e })
  );
});
