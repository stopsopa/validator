"use strict";

try {
  require("karma_polyfill");
} catch (e) {}

const validator = require("../../validator");

const Type = require("../../validator/constraints/Type");

const Length = require("../../validator/constraints/Length");

const Collection = require("../../validator/constraints/Collection");

it("Type", () => {
  var k = new Type("array");

  expect(k.errorNames()).toEqual({
    INVALID_TYPE_ERROR: Type.prototype.INVALID_TYPE_ERROR,
  });
});

it("Type - custom message", (done) => {
  validator(
    [],
    new Type({
      message: "Custom message: {{ type }}.",
      type: "object",
    })
  ).then(
    (errors) => {
      const row = errors.getRaw();

      expect(row).toEqual([[undefined, "Custom message: object.", "INVALID_TYPE_ERROR", []]]);

      done();
    },
    (e) => done({ e })
  );
});

it("Type - stop", (done) => {
  validator(
    {
      a: "a",
      b: {},
    },
    new Collection({
      a: new Length(2, { async: 1 }),
      b: new Type("array", { stop: true }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([["b", "This value should be of type 'array'.", "INVALID_TYPE_ERROR", {}]]);

      done();
    },
    (e) => done({ e })
  );
});

it("Type - not string", (done) => {
  try {
    validator(
      "one",
      new Type({
        type: false,
      })
    );
  } catch (e) {
    
    expect(String(e)).toEqual(
      `Error: Type constraint: Each of types have to be string and one of: "undefined", "obj", "object", "boolean", "bool", "number", "str", "string", "symbol", "function", "integer", "int", "arr", "array"`
    );

    done();
  }
});

it("Type - string", (done) => {
  try {
    validator(
      "one",
      new Type({
        type: "other",
      })
    );
  } catch (e) {

    expect(String(e)).toEqual(
      `Error: Type constraint: One of types is string but is not one of: "undefined", "obj", "object", "boolean", "bool", "number", "str", "string", "symbol", "function", "integer", "int", "arr", "array"`
    );

    done();
  }
});

it("Type - array of types - ok", (done) => {
  validator(
    56,
    new Type({
      type: ["string", "integer"],
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

it("Type - int", (done) => {
  validator(
    56,
    new Type({
      type: ["string", "int"],
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

it("Type - bool", (done) => {
  validator(
    true,
    new Type({
      type: ["string", "bool"],
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

it("Type - str", (done) => {
  validator(
    "test",
    new Type({
      type: ["str"],
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

it("Type - array of types - wrong type", (done) => {
  try {
    validator(
      true,
      new Type({
        type: ["string", "iii"],
      })
    );
  } catch (e) {
    
    expect(String(e)).toEqual(
      `Error: Type constraint: One of types is string but is not one of: "undefined", "obj", "object", "boolean", "bool", "number", "str", "string", "symbol", "function", "integer", "int", "arr", "array"`
    );

    done();
  }
});

it("Type - array of types - wrong value type", (done) => {
  validator(
    true,
    new Type({
      type: ["string", "integer"],
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'string, integer'.", "INVALID_TYPE_ERROR", true]]);

      done();
    },
    (e) => done({ e })
  );
});

it("Type - check all types", (done) => {
  const data = {
    undefined: undefined,
    object: {},
    boolean: true,
    number: 67.6,
    string: "str",
    function: function () {},
    integer: 45,
    array: [],
    "number boolean": 56,
    "number boolean ": false,
    "string function": function () {},
    "string function ": "",
    "string function  ": "a",
    "undefined integer": undefined,
    "undefined integer ": 7,
  };

  const keys = Object.keys(data);

  Promise.all(
    keys.map((type, i) => {
      let key = type;

      if (type.indexOf(" ") !== -1) {
        type = type.split(" ").filter((a) => a);
      }

      return validator(data[key], new Type(type, { async: i })).then((errors) => {
        errors = errors.getRaw();

        expect(errors).toEqual([]);
      });
    })
  ).then(
    () => done(),
    (e) => done({ e })
  );
});
