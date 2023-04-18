"use strict";

try {
  require("karma_polyfill");
} catch (e) {}

const validator = require("../../validator");

const All = require("../../validator/constraints/All");

const Collection = require("../../validator/constraints/Collection");

const Length = require("../../validator/constraints/Length");

const IsNull = require("../../validator/constraints/IsNull");

const Context = require("../../validator/logic/Context");

it("All - empty", () => {
  return validator(null, new All()).then((errors) => {
    errors = errors.getRaw();

    expect(JSON.stringify(errors)).toBe(JSON.stringify([]));
  });
});

it("All", () => {
  return validator(
    [
      {
        a: "d",
        b: "f",
        e: false,
        f: null,
      },
      {
        // a: 'h',
        // b: 'cb'
      },
    ],
    new All(
      new Collection({
        a: new Length(1),
        b: new Length(1),
        c: new IsNull(),
      })
    )
  ).then((errors) => {
    errors = errors.getRaw();

    expect(JSON.stringify(errors)).toBe(
      JSON.stringify([
        [
          "0.c",
          "This field is missing.",
          "MISSING_FIELD_ERROR",
          {
            a: "d",
            b: "f",
            e: false,
            f: null,
          },
        ],
        [
          "0.e",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            a: "d",
            b: "f",
            e: false,
            f: null,
          },
        ],
        [
          "0.f",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            a: "d",
            b: "f",
            e: false,
            f: null,
          },
        ],
        ["1.a", "This field is missing.", "MISSING_FIELD_ERROR", {}],
        ["1.b", "This field is missing.", "MISSING_FIELD_ERROR", {}],
        ["1.c", "This field is missing.", "MISSING_FIELD_ERROR", {}],
      ])
    );
  });
});

it("All - nested", () => {
  return validator(
    [
      [
        {
          a: "b",
        },
      ],
      [
        {
          a: "d",
        },
        {
          a: "c2",
        },
      ],
    ],
    new All(
      new All(
        new Collection({
          a: new Length(1),
        })
      )
    )
  ).then((errors) => {
    errors = errors.getRaw();

    expect(JSON.stringify(errors)).toBe(
      JSON.stringify([["1.1.a", "This value should have exactly 1 character.", "TOO_LONG_ERROR", "c2"]])
    );
  });
});
