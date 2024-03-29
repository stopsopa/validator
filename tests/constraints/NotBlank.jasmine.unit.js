"use strict";



const validator = require("../../validator");

const NotBlank = require("../../validator/constraints/NotBlank");

const Length = require("../../validator/constraints/Length");

const Collection = require("../../validator/constraints/Collection");

it("NotBlank", () => {
  var k = new NotBlank();

  expect(k.errorNames()).toEqual({
    IS_BLANK_ERROR: NotBlank.prototype.IS_BLANK_ERROR,
  });
});

it("NotBlank - not blank", (done) => {
  validator(
    {
      a: "a",
      b: "test",
    },
    new Collection({
      a: new Length(2),
      b: new NotBlank(),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([["a", "This value should have exactly 2 characters.", "TOO_SHORT_ERROR", "a"]]);

      done();
    },
    (e) => done({ e })
  );
});

it("NotBlank - custom message", (done) => {
  validator("", new NotBlank("custom message")).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "custom message", "IS_BLANK_ERROR", ""]]);

      done();
    },
    (e) => done({ e })
  );
});

it("NotBlank - stop", (done) => {
  validator(
    {
      a: "a",
      b: "",
    },
    new Collection({
      a: new Length(2, { async: 1 }),
      b: new NotBlank(undefined, { stop: true }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([["b", "This value should not be blank.", "IS_BLANK_ERROR", ""]]);

      done();
    },
    (e) => done({ e })
  );
});
