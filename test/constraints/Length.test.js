"use strict";

try {
  require("karma_polyfill");
} catch (e) {}

const validator = require("../../validator");

const IsNull = require("../../validator/constraints/IsNull");

const Length = require("../../validator/constraints/Length");

const Collection = require("../../validator/constraints/Collection");

it("Length - error types", () => {
  var k = new Length(3);

  expect(k.errorNames()).toEqual({
    TOO_SHORT_ERROR: Length.prototype.TOO_SHORT_ERROR,
    TOO_LONG_ERROR: Length.prototype.TOO_LONG_ERROR,
  });
});

it("Length - no arg", (done) => {
  try {
    const k = new Length();
  } catch (e) {
    expect(String(e)).toBe("Length: options must be given for this constraint");

    done();
  }
});

it("Length - wrong arg type", (done) => {
  try {
    const k = new Length(false);
  } catch (e) {
    expect(String(e)).toBe("Length: Wrong parameter type have been given to this constraint, typeof: boolean");

    done();
  }
});

it("Length - no min & no max", (done) => {
  try {
    const k = new Length({});
  } catch (e) {
    expect(String(e)).toBe('Length: Either option "min" or "max" must be given for constraint');

    done();
  }
});
it("Length - false", (done) => {
  validator(
    {
      z: false,
    },
    new Collection({
      z: new Length({
        min: 1,
        max: 2,
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
it("Length - true", (done) => {
  validator(
    {
      z: true,
    },
    new Collection({
      z: new Length({
        min: 1,
        max: 2,
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

it(`Length - min: 1, max: 2 -> abc`, (done) => {
  validator(
    {
      z: "abc",
    },
    new Collection({
      z: new Length({
        min: 1,
        max: 2,
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["z", "This value is too long. It should have 2 characters or less.", "TOO_LONG_ERROR", "abc"],
      ]);

      done();
    },
    (e) => done({ e })
  );
});

it(`Length - min: 1, max: 1 -> abc`, (done) => {
  validator(
    {
      z: "abc",
    },
    new Collection({
      z: new Length({
        min: 1,
        max: 1,
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["z", "This value should have exactly 1 character.", "TOO_LONG_ERROR", "abc"]]);

      done();
    },
    (e) => done({ e })
  );
});

it(`Length - min: 2 -> abc`, (done) => {
  validator(
    {
      z: "a",
    },
    new Collection({
      z: new Length({
        min: 2,
      }),
    })
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([
        ["z", "This value is too short. It should have 2 characters or more.", "TOO_SHORT_ERROR", "a"],
      ]);

      done();
    },
    (e) => done({ e })
  );
});

it("Length stop 1", (done) => {
  (async function () {
    let errors;

    errors = await validator(
      {
        a: "abc",
        b: "abc",
      },
      new Collection({
        a: new Length({
          max: 2,
        }),
        b: new Length({
          max: 2,
        }),
      })
    );

    expect(errors.getTree(true)).toEqual({
      a: ["This value is too long. It should have 2 characters or less."],
      b: ["This value is too long. It should have 2 characters or less."],
    });

    done();
  })();
});

it("Length stop 2", (done) => {
  (async function () {
    let errors;

    errors = await validator(
      {
        a: "abc",
        b: "abc",
      },
      new Collection({
        a: new Length(
          {
            max: 2,
          },
          {
            stop: true,
            async: -1,
          }
        ),
        b: new Length({
          max: 2,
        }),
      })
    );

    expect(errors.getTree(true)).toEqual({
      a: ["This value is too long. It should have 2 characters or less."],
    });

    done();
  })();
});

it("Length min: 1", (done) => {
  (async function () {
    let errors;

    errors = await validator(
      {
        a: "",
      },
      new Collection({
        a: new Length({
          min: 1,
        }),
      })
    );

    expect(errors.getTree(true)).toEqual({ a: ["This value is too short. It should have 1 character or more."] });

    done();
  })();
});

it("Length min: 1, max: 1", (done) => {
  (async function () {
    let errors;

    errors = await validator(
      {
        a: "",
      },
      new Collection({
        a: new Length({
          min: 1,
          max: 1,
        }),
      })
    );

    expect(errors.getTree(true)).toEqual({ a: ["This value should have exactly 1 character."] });

    done();
  })();
});
