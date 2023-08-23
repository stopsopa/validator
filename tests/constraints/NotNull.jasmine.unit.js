"use strict";



const validator = require("../../validator");

const NotNull = require("../../validator/constraints/NotNull");

const Count = require("../../validator/constraints/Count");

const Collection = require("../../validator/constraints/Collection");

it("NotNull", () => {
  var k = new NotNull();

  expect(k.errorNames()).toEqual({
    IS_NULL_ERROR: NotNull.prototype.IS_NULL_ERROR,
  });
});

it("NotNull() - used as a function", (done) => {
  try {
    validator(
      null,
      new Collection({
        test: NotNull(),
      })
    );
  } catch (e) {
    expect(String(e)).toEqual("Error: It is necessary to use operator 'new' with all constraints");

    done();
  }
});

it("NotNull - custom message", (done) => {
  validator(null, new NotNull("custom message")).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "custom message", "IS_NULL_ERROR", null]]);

      done();
    },
    (e) => done({ e })
  );
});
it("NotNull - stop [part 1]", (done) => {
  validator(
    {
      z: null,
      b: {
        a: {
          a: "b",
          c: "d",
          d: "f",
        },
      },
    },
    new Collection({
      z: new NotNull(),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["z", "This value should be true.", "IS_NULL_ERROR", null],
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
it("NotNull - stop [part 2]", (done) => {
  validator(
    {
      z: null,
      b: {
        a: {
          a: "b",
          c: "d",
          d: "f",
        },
      },
    },
    new Collection({
      z: new NotNull(undefined, { async: -1, stop: true }),
      b: new Collection({
        a: new Count({ min: 2, max: 2 }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["z", "This value should be true.", "IS_NULL_ERROR", null]]);

      done();
    },
    (e) => done({ e })
  );
});

it("NotNull - null", (done) => {
  validator(
    {
      z: false,
    },
    new Collection({
      z: new NotNull(),
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
