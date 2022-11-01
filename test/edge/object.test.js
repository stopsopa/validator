"use strict";

const validator = require("../../validator");

const Email = require("../../validator/constraints/Email");

const Count = require("../../validator/constraints/Count");
const Length = require("../../validator/constraints/Length");

const Collection = require("../../validator/constraints/Collection");

const { Required, Type, Optional } = require("../../validator");

describe("main level with object", () => {
  it("001  - normal", (done) => {
    /**
     * there is no way to not give config object into Collection or give empty object,
     * you have to specify at least one field for Collection.
     * On the other hand if you wan't to validate empty object use new Type('object')
     */
    (async function () {
      const errors = await validator(
        {},
        new Collection({
          a: new Type("str"),
        })
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([["a", "This field is missing.", "MISSING_FIELD_ERROR", {}]]);

      done();
    })();
  });

  it("001  - warning", (done) => {
    (async function () {
      const errors = await validator(
        6,
        new Collection({
          a: new Type("str"),
          b: new Required([
            new Type("str"),
            new Length({
              min: 1,
              max: 2,
            }),
          ]),
        })
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("001  - better but still warning", (done) => {
    (async function () {
      const errors = await validator(
        6,
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("001  - better 2 but still warning", (done) => {
    (async function () {
      const errors = await validator(
        {},
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["a", "This field is missing.", "MISSING_FIELD_ERROR", {}],
        ["b", "This field is missing.", "MISSING_FIELD_ERROR", {}],
      ]);

      done();
    })();
  });

  it("001  - warning", (done) => {
    (async function () {
      const errors = await validator(
        null,
        new Collection({
          a: new Type("str"),
        })
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("001  - warning", (done) => {
    (async function () {
      const errors = await validator(
        undefined,
        new Collection({
          a: new Type("str"),
        })
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });
});

describe("main level with object - with optional", () => {
  it("001  - normal", (done) => {
    /**
     * there is no way to not give config object into Collection or give empty object,
     * you have to specify at least one field for Collection.
     * On the other hand if you wan't to validate empty object use new Type('object')
     */
    (async function () {
      const errors = await validator(
        {},
        new Optional([
          new Type("object"),
          new Collection({
            a: new Type("str"),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([["a", "This field is missing.", "MISSING_FIELD_ERROR", {}]]);

      done();
    })();
  });

  it("002  - normal", (done) => {
    (async function () {
      const errors = await validator(
        6,
        new Optional([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("001  - normal", (done) => {
    (async function () {
      const errors = await validator(
        6,
        new Optional([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("001  - better 2 but still warning", (done) => {
    (async function () {
      const errors = await validator(
        {},
        new Optional([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["a", "This field is missing.", "MISSING_FIELD_ERROR", {}],
        ["b", "This field is missing.", "MISSING_FIELD_ERROR", {}],
      ]);

      done();
    })();
  });

  it("001  - normal", (done) => {
    (async function () {
      const errors = await validator(
        null,
        new Optional([
          new Type("object"),
          new Collection({
            a: new Type("str"),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("0018  - kinda normal", (done) => {
    (async function () {
      const errors = await validator(
        undefined,
        new Optional([
          new Type("object"),
          new Collection({
            a: new Type("str"),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", undefined]]);

      done();
    })();
  });
});

describe("main level with object - with required", () => {
  it("001  - normal", (done) => {
    /**
     * there is no way to not give config object into Collection or give empty object,
     * you have to specify at least one field for Collection.
     * On the other hand if you wan't to validate empty object use new Type('object')
     */
    (async function () {
      const errors = await validator(
        {},
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([["a", "This field is missing.", "MISSING_FIELD_ERROR", {}]]);

      done();
    })();
  });

  it("002  - normal", (done) => {
    (async function () {
      const errors = await validator(
        6,
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("001  - normal", (done) => {
    (async function () {
      const errors = await validator(
        6,
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", 6]]);

      done();
    })();
  });

  it("001  - better 2 but still warning", (done) => {
    (async function () {
      const errors = await validator(
        {},
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
            b: new Required([
              new Type("str"),
              new Length({
                min: 1,
                max: 2,
              }),
            ]),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["a", "This field is missing.", "MISSING_FIELD_ERROR", {}],
        ["b", "This field is missing.", "MISSING_FIELD_ERROR", {}],
      ]);

      done();
    })();
  });

  it("001  - normal", (done) => {
    (async function () {
      const errors = await validator(
        null,
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([]);

      done();
    })();
  });

  it("0018  - kinda normal", (done) => {
    (async function () {
      const errors = await validator(
        undefined,
        new Required([
          new Type("object"),
          new Collection({
            a: new Type("str"),
          }),
        ])
      );

      const raw = errors.getRaw();

      expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", undefined]]);

      done();
    })();
  });
});
