"use strict";

try {
  require("karma_polyfill");
} catch (e) {}

const validator = require("../../validator");

const Collection = require("../../validator/constraints/Collection");

const Required = require("../../validator/constraints/Required");

const Optional = require("../../validator/constraints/Optional");

const Length = require("../../validator/constraints/Length");

const Type = require("../../validator/constraints/Type");

const IsNull = require("../../validator/constraints/IsNull");

const Context = require("../../validator/logic/Context");

it("Collection allowExtraFields = false & allowMissingFields = false: both", (done) => {
  validator(
    {
      extra: false, // checking existance not value
      one: "two",
      three: "four",
    },
    new Collection({
      one: new Optional(),
      three: new Required(),
      n: new IsNull(),
    }),
    {
      // debug: true,
    }
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        [
          "n",
          "This field is missing.",
          "MISSING_FIELD_ERROR",
          {
            extra: false,
            one: "two",
            three: "four",
          },
        ],
        [
          "extra",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            extra: false,
            one: "two",
            three: "four",
          },
        ],
      ]);

      const flat = errors.getFlat(true);

      expect(flat).toEqual({ extra: ["This field was not expected."], n: ["This field is missing."] });

      done();
    },
    (e) => done({ e })
  );
});

it("Collection allowExtraFields = false & allowMissingFields = false: missing", (done) => {
  validator(
    {
      // extra   : false, // checking existance not value
      // one     : 'two',
      // three    : 'four',
    },
    new Collection({
      one: new Required(),
      two: new Required(),
    }),
    {
      // debug: true,
    }
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["one", "This field is missing.", "MISSING_FIELD_ERROR", {}],
        ["two", "This field is missing.", "MISSING_FIELD_ERROR", {}],
      ]);

      const flat = errors.getFlat(true);

      expect(flat).toEqual({ one: ["This field is missing."], two: ["This field is missing."] });
      done();
    },
    (e) => done({ e })
  );
});

it("Collection allowExtraFields = false & allowMissingFields = false: extra", (done) => {
  validator(
    {
      test: null,
      two: true,
      one: false, // checking existance not value
    },
    new Collection({
      test: new IsNull(),
      // one     : new Required(),
      // two     : new Required(),
    }),
    {
      // debug: true,
    }
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([
        [
          "two",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            test: null,
            two: true,
            one: false,
          },
        ],
        [
          "one",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            test: null,
            two: true,
            one: false,
          },
        ],
      ]);

      done();
    },
    (e) => done({ e })
  );
});

it("key - Collection - no options", (done) => {
  try {
    validator("test", new Collection());
  } catch (e) {
    expect(String(e)).toBe("Error: Collection accept only plain object as a first argument");

    done();
  }
});

it("key - Collection - array option", (done) => {
  try {
    validator("test", new Collection([]));
  } catch (e) {
    expect(String(e)).toBe("Error: Collection accept only plain object as a first argument");

    done();
  }
});

it("key - Collection - empty object option", (done) => {
  try {
    validator("test", new Collection({}));
  } catch (e) {
    expect(String(e)).toBe('Error: Describe at least one field in "fields" parameter');

    done();
  }
});

it("key - Collection - string but expect object with field [part 1]", (done) => {
  validator(
    "test",
    new Collection({
      test: new IsNull(),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("key - Collection - string but expect object with field [part 2] - explicit way of enforcing object", (done) => {
  validator(
    "test",
    new Required([
      new Type("object"),
      new Collection({
        test: new IsNull(),
      }),
    ])
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", "test"]]);

      done();
    },
    (e) => done({ e })
  );
});

it("key - Collection - used together with other constraint array", (done) => {
  validator("test", [
    new IsNull(),
    new Collection({
      test: new IsNull(),
    }),
  ]).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "This value should be null.", "NOT_NULL_ERROR", "test"]]);

      expect(errors[0][0]).toBeUndefined();

      done();
    },
    (e) => done({ e })
  );
});

it("key - Collection - used together with other constraint require", (done) => {
  validator(
    "test",
    new Required([
      new IsNull(),
      new Collection({
        test: new IsNull(),
      }),
    ])
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "This value should be null.", "NOT_NULL_ERROR", "test"]]);

      expect(errors[0][0]).toEqual();

      done();
    },
    (e) => done({ e })
  );
});

it("key - Collection - used together with other constrain require x2", (done) => {
  validator(
    "test",
    new Required(
      new Optional([
        new IsNull(),
        new Collection({
          test: new IsNull(),
        }),
      ])
    )
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "This value should be null.", "NOT_NULL_ERROR", "test"]]);

      expect(errors[0][0]).toBeUndefined();

      done();
    },
    (e) => done({ e })
  );
});

it("Collection-nested allowExtraFields = false & allowMissingFields = false: both", (done) => {
  validator(
    {
      a: false, // checking existance not value
      b: {
        second: "level",
      },
      d: {
        e: null,
        f: true,
      },
    },
    new Collection({
      a: new Required(),
      b: new Collection({
        c: new Required(),
      }),
      d: new Collection({
        e: new IsNull(),
        f: new IsNull(),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        [
          "b.c",
          "This field is missing.",
          "MISSING_FIELD_ERROR",
          {
            second: "level",
          },
        ],
        [
          "b.second",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            second: "level",
          },
        ],
        ["d.f", "This value should be null.", "NOT_NULL_ERROR", true],
      ]);

      const flat = errors.getFlat(true);

      expect(flat).toEqual({
        "b.c": ["This field is missing."],
        "b.second": ["This field was not expected."],
        "d.f": ["This value should be null."],
      });

      const tree = errors.getTree(true);

      expect(tree).toEqual({
        b: {
          c: ["This field is missing."],
          second: ["This field was not expected."],
        },
        d: {
          f: ["This value should be null."],
        },
      });

      done();
    },
    (e) => done({ e })
  );
});

it("stack overflow", (done) => {
  const num = 200;

  function buildData(left) {
    const data = {};

    if (left) {
      data.test = buildData(left - 1);
    }

    return data;
  }

  const data = buildData(num);

  // process.stdout.write(`\n\n\n`);
  //
  // console.log(JSON.stringify(data, null, 4));
  //
  // process.stdout.write(`\n\n\n`);

  const buildConstraints = (left) =>
    new Collection({
      test: left ? buildConstraints(left - 1) : new IsNull(),
    });

  const constraints = buildConstraints(num);

  // process.stdout.write(`\n\n\n`);
  //
  // console.log(JSON.stringify(constraints, null, 4));
  //
  // process.stdout.write(`\n\n\n`);

  validator(data, constraints).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([
        [
          Array(201)
            .join(".")
            .split(".")
            .map(() => "test")
            .join("."),
          "This field is missing.",
          "MISSING_FIELD_ERROR",
          {},
        ],
      ]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection on array", (done) => {
  validator(
    {
      a: "test",
      z: "te",
      // b: [
      //     {
      //         c: 'd',
      //         e: 'f'
      //     },
      //     {
      //         g: 'h'
      //     }
      // ],
      b: {
        // '0': {
        //     c: 'd',
        //     e: 'f'
        // },
        1: {
          g: "h",
        },
      },
    },
    new Collection({
      a: new Required(new Length(4)),
      z: new Length(2),
      b: new Collection({
        0: new Collection({
          e: new Length(2),
        }),
        1: new Collection({
          g: new Length(23),
          // e: new Length(2),
        }),
      }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([
        [
          "b.0",
          "This field is missing.",
          "MISSING_FIELD_ERROR",
          {
            1: {
              g: "h",
            },
          },
        ],
        ["b.1.g", "This value should have exactly 23 characters.", "TOO_SHORT_ERROR", "h"],
      ]);

      done();
    },
    (e) => done({ e })
  );
});
it("Collection on array 2", (done) => {
  validator(
    {
      a: "test",
      z: "te",
      b: [
        {
          c: "d",
          e: "f",
        },
        {
          g: "h",
        },
        {
          g: "h1",
        },
      ],
      // b: {
      //     // '0': {
      //     //     c: 'd',
      //     //     e: 'f'
      //     // },
      //     '1': {
      //         g: 'h'
      //     }
      // },
    },
    new Collection({
      a: new Required(new Length(4)),
      z: new Length(2),
      b: new Collection({
        0: new Collection({
          e: new Length(1),
        }),
        1: new Collection({
          g: new Length(2),
          // e: new Length(2),
        }),
        2: new Collection({
          g: new Length(1),
          // e: new Length(2),
        }),
      }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([
        [
          "b.0.c",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            c: "d",
            e: "f",
          },
        ],
        ["b.1.g", "This value should have exactly 2 characters.", "TOO_SHORT_ERROR", "h"],
        ["b.2.g", "This value should have exactly 1 character.", "TOO_LONG_ERROR", "h1"],
      ]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection on array 3", (done) => {
  validator(
    [
      {
        c: "d",
        e: "f",
      },
      {
        g: "h",
      },
    ],
    new Collection({
      0: new Collection({
        e: new Length(1),
      }),
      1: new Collection({
        g: new Length(2),
        // e: new Length(2),
      }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([
        [
          "0.c",
          "This field was not expected.",
          "NO_SUCH_FIELD_ERROR",
          {
            c: "d",
            e: "f",
          },
        ],
        ["1.g", "This value should have exactly 2 characters.", "TOO_SHORT_ERROR", "h"],
      ]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection - allowMissingFields: false", (done) => {
  validator(
    {
      a: null,
    },
    new Collection({
      a: new IsNull(),
      b: new Length(3),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([["b", "This field is missing.", "MISSING_FIELD_ERROR", { a: null }]]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection - allowMissingFields: true", (done) => {
  validator(
    {
      a: null,
    },
    new Collection({
      fields: {
        a: new IsNull(),
        b: new Length(3),
      },
      allowMissingFields: true,
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection deep - allowMissingFields: false", (done) => {
  validator(
    {
      a: {
        b: {
          c: "abc",
        },
      },
    },
    new Collection({
      a: new Collection({
        b: new Collection({
          c: new Length(3),
          d: new Length(2),
        }),
      }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([
        [
          "a.b.d",
          "This field is missing.",
          "MISSING_FIELD_ERROR",
          {
            c: "abc",
          },
        ],
      ]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection deep - allowMissingFields: true", (done) => {
  validator(
    {
      a: {
        b: {
          c: "abc",
        },
      },
    },
    new Collection({
      a: new Collection({
        b: new Collection({
          fields: {
            c: new Length(3),
            d: new Length(2),
          },
          allowMissingFields: true,
        }),
      }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection deep, no data", (done) => {
  validator(
    {
      a: {
        b: null,
      },
    },
    new Collection({
      a: new Collection({
        b: new Collection({
          fields: {
            c: new Length(3),
            d: new Length(2),
          },
          // allowMissingFields: true,
        }),
      }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection - array as a root", (done) => {
  validator("abc", [new Required(new Length(4))]).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([[undefined, "This value should have exactly 4 characters.", "TOO_SHORT_ERROR", "abc"]]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection - no constraints true", (done) => {
  validator("abc", true).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection - no constraints false", (done) => {
  validator("abc", false).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection - no constraints undefined", (done) => {
  validator("abc").then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection no data", (done) => {
  validator(
    undefined,
    new Collection({
      a: new Collection({
        b: new Collection({
          fields: {
            c: new Length(3),
            d: new Length(2),
          },
          // allowMissingFields: true,
        }),
      }),
    })
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(errors).toEqual([]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection missing fields [part 1]", (done) => {
  validator(
    {
      a: {},
    },
    new Collection({
      a: new Collection({
        b: new Collection({
          fields: {
            c: new Length(3),
            d: new Length(2),
          },
          // allowMissingFields: true,
        }),
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["a.b", "This field is missing.", "MISSING_FIELD_ERROR", {}]]);

      done();
    },
    (e) => done({ e })
  );
});

it("Collection missing fields [part 2]", (done) => {
  validator(
    {
      a: {},
    },
    new Collection({
      a: new Collection({
        fields: {
          b: new Collection({
            fields: {
              c: new Length(3),
              d: new Length(2),
            },
            // allowMissingFields: true,
          }),
        },
        allowMissingFields: true,
      }),
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
