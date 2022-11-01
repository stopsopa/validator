"use strict";

const validator = require("../../validator");

const Email = require("../../validator/constraints/Email");

const Count = require("../../validator/constraints/Count");
const Length = require("../../validator/constraints/Length");

const Collection = require("../../validator/constraints/Collection");

const { Required, Type, Optional } = require("../../validator");

describe("others", () => {
  it("obj with required str, empty obj given  - normal", (done) => {
    (async function () {
      const errors = await validator({}, new Collection({ a: new Required(new Type("str")) }));

      const raw = errors.getRaw();

      expect(raw).toEqual([["a", "This field is missing.", "MISSING_FIELD_ERROR", {}]]);

      done();
    })();
  });

  it("optional exist   - normal", (done) => {
    (async function () {
      const errors = await validator(
        {
          a: "a val",
        },
        new Collection({
          a: new Optional(new Type("str")),
        })
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("optional not exist   - normal", (done) => {
    (async function () {
      const errors = await validator(
        {},
        new Collection({
          a: new Optional(new Type("str")),
        })
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("optional not exist - entire object   - don't remember what is the default but seems normal", (done) => {
    (async function () {
      const errors = await validator(
        null,
        new Collection({
          a: new Optional(new Type("str")),
        })
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("prop in object is required but not given in data object - natural", (done) => {
    (async function () {
      const errors = await validator(
        {},
        new Required(
          new Collection({
            a: new Required(new Type("str")),
          })
        )
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([["a", "This field is missing.", "MISSING_FIELD_ERROR", {}]]);

      done();
    })();
  });
});
