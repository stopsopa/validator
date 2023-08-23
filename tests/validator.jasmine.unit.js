"use strict";



const validator = require("../validator");

const Collection = require("../validator/constraints/Collection");

const Required = require("../validator/constraints/Required");

const Optional = require("../validator/constraints/Optional");

const Length = require("../validator/constraints/Length");

const IsNull = require("../validator/constraints/IsNull");

const Callback = require("../validator/constraints/Callback");

const Context = require("../validator/logic/Context");

const ValidatorLogicError = require("../validator/ValidatorLogicError");

it("validator - one validator failed", (done) => {
  validator("test", new IsNull()).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(
        JSON.stringify([[null, "This value should be null.", IsNull.prototype.NOT_NULL_ERROR, "test"]])
      );

      done();
    },
    (e) => done({ e })
  );
});

it("validator - two validators failed", (done) => {
  validator("test", [new IsNull(), new Length(3)]).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(
        JSON.stringify([
          [null, "This value should be null.", IsNull.prototype.NOT_NULL_ERROR, "test"],
          [null, "This value should have exactly 3 characters.", Length.prototype.TOO_LONG_ERROR, "test"],
        ])
      );

      done();
    },
    (e) => done({ e })
  );
});
it("grouping into separate async groups", (done) => {
  validator("test", [
    new IsNull({
      async: -20,
    }),
    new Length({
      min: 3,
      max: 3,
      async: 10,
    }),
  ]).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(
        JSON.stringify([
          [null, "This value should be null.", IsNull.prototype.NOT_NULL_ERROR, "test"],
          [null, "This value should have exactly 3 characters.", Length.prototype.TOO_LONG_ERROR, "test"],
        ])
      );

      done();
    },
    (e) => done({ e })
  );
});

it("errorMode=raw", (done) => {
  validator(
    "test",
    [
      new IsNull(undefined, {
        stop: 1,
      }),
    ],
    { errorMode: "raw" }
  ).then(
    (errors) => {
      done(`Shouldn't happen`);
    },
    (e) => {
      expect(Array.isArray(e)).toEqual(true);

      expect(e).toEqual([{ data: "stop IsNull", resolved: false }]);

      done();
    }
  );
});

it("errorMode=errors", (done) => {
  validator(
    "test",
    [
      new IsNull(undefined, {
        stop: 1,
      }),
    ],
    { errorMode: "errors" }
  ).then(
    (errors) => {
      done(`Shouldn't happen`);
    },
    (e) => {
      expect(Array.isArray(e)).toEqual(true);

      expect(e.length === 1).toEqual(true);

      expect(e[0] instanceof Error).toEqual(true);

      expect(e[0].name).toEqual("Error");

      expect(String(e[0])).toEqual("Error: stop IsNull");

      done();
    }
  );
});

it("errorMode=justStop", (done) => {
  validator(
    "test",
    [
      new IsNull(undefined, {
        async: -20,
        stop: true,
      }),
      new Length(
        {
          min: 3,
          max: 3,
        },
        {
          async: 10,
          stop: true,
        }
      ),
    ],
    { errorMode: "justStop" }
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(
        JSON.stringify([[null, "This value should be null.", IsNull.prototype.NOT_NULL_ERROR, "test"]])
      );

      done();
    },
    (e) => done({ e })
  );
});
