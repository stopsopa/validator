"use strict";



const validator = require("../../validator");

const IsTrue = require("../../validator/constraints/IsTrue");

const Count = require("../../validator/constraints/Count");

const Collection = require("../../validator/constraints/Collection");

it("IsTrue", () => {
  var k = new IsTrue();

  expect(k.errorNames()).toEqual({
    NOT_TRUE_ERROR: IsTrue.prototype.NOT_TRUE_ERROR,
  });
});

it("IsTrue() - used as a function", (done) => {
  try {
    validator(
      "test",
      new Collection({
        test: IsTrue(),
      })
    );
  } catch (e) {
    expect(String(e)).toBe("Error: It is necessary to use operator 'new' with all constraints");

    done();
  }
});

it("IsTrue - custom message", (done) => {
  validator("test", new IsTrue("custom message")).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "custom message", "NOT_TRUE_ERROR", "test"]]);

      done();
    },
    (e) => done({ e })
  );
});

it("IsTrue - is actually true", (done) => {
  validator(true, new IsTrue()).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});
it("IsTrue - stop [part 1]", (done) => {
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
      z: new IsTrue(),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["z", "This value should be true.", "NOT_TRUE_ERROR", false],
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
it("IsTrue - stop [part 2]", (done) => {
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
      z: new IsTrue(undefined, { async: -1, stop: true }),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["z", "This value should be true.", "NOT_TRUE_ERROR", false]]);

      done();
    },
    (e) => done({ e })
  );
});
