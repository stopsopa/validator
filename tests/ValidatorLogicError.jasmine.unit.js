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

it("errorMode=exceptionalThrow is default - implicit 1", (done) => {
  validator(
    "test",
    [
      new IsNull(undefined, {
        stop: 1,
      }),
    ]
    // { errorMode: "exceptionalThrow" }, // not specified
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(
        JSON.stringify([[null, "This value should be null.", IsNull.prototype.NOT_NULL_ERROR, "test"]])
      );

      done();
    },
    (e) => {
      done({ e });
    }
  );
});

it("errorMode=exceptionalThrow is default - explicit 1", (done) => {
  validator(
    "test",
    [
      new IsNull(undefined, {
        stop: 1,
      }),
    ],
    { errorMode: "exceptionalThrow" }
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(
        JSON.stringify([[null, "This value should be null.", IsNull.prototype.NOT_NULL_ERROR, "test"]])
      );

      done();
    },
    (e) => {
      done({ e });
    }
  );
});

it("errorMode=exceptionalThrow is default - implicit 2", (done) => {
  validator(
    "test",
    [
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "implicit 1 1";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 1, stop: true }
      ),
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "implicit 1 2";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 2, stop: false }
      ),
    ]
    // { errorMode: "exceptionalThrow" }, // not specified
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(JSON.stringify([[null, "Not unique", "implicit 1 1", "xxx"]]));

      done();
    },
    (e) => {
      done({ e });
    }
  );
});

it("errorMode=exceptionalThrow is default - explicit 2", (done) => {
  validator(
    "test",
    [
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "implicit 2 1";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 1, stop: true }
      ),
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "implicit 2 2";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 2, stop: false }
      ),
    ],
    { errorMode: "exceptionalThrow" } // not specified
  ).then(
    (errors) => {
      errors = errors.getRaw();

      expect(JSON.stringify(errors)).toBe(JSON.stringify([[null, "Not unique", "implicit 2 1", "xxx"]]));

      done();
    },
    (e) => {
      done({ e });
    }
  );
});

it("errorMode=exceptionalThrow is default - implicit 3", (done) => {
  validator(
    "test",
    [
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "implicit 3 1";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new ValidatorLogicError("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 1, stop: true }
      ),
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "implicit 3 2";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new ValidatorLogicError("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 2, stop: false }
      ),
    ]
    // { errorMode: "exceptionalThrow" }, // not specified
  ).then(
    (errors) => {
      done(`Shouldn't happen`);
    },
    (e) => {
      expect(e instanceof ValidatorLogicError).toEqual(true);

      expect(e.name).toEqual("ValidatorLogicError");

      expect(String(e)).toEqual("ValidatorLogicError: reject implicit 3 1");

      done();
    }
  );
});

it("errorMode=exceptionalThrow is default - explicit 3", (done) => {
  validator(
    "test",
    [
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "explicit 3 1";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new ValidatorLogicError("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 1, stop: true }
      ),
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "explicit 3 2";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new ValidatorLogicError("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 2, stop: false }
      ),
    ],
    { errorMode: "exceptionalThrow" } // not specified
  ).then(
    (errors) => {
      done(`Shouldn't happen`);
    },
    (e) => {
      expect(e instanceof ValidatorLogicError).toEqual(true);

      expect(e.name).toEqual("ValidatorLogicError");

      expect(String(e)).toEqual("ValidatorLogicError: reject explicit 3 1");

      done();
    }
  );
});

it("errorMode=firstError", (done) => {
  validator(
    "test",
    [
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "explicit 3 1";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 1, stop: true }
      ),
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "explicit 3 2";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 2, stop: false }
      ),
    ],
    { errorMode: "firstError" } // not specified
  ).then(
    (errors) => {
      done(`Shouldn't happen`);
    },
    (e) => {
      expect(e instanceof Error).toEqual(true);

      expect(e.name).toEqual("Error");

      expect(String(e)).toEqual("Error: reject explicit 3 1");

      done();
    }
  );
});

it("errorMode=errors", (done) => {
  validator(
    "test",
    [
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "explicit 3 1";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 1, stop: true }
      ),
      new Callback(
        (value, context, path, extra) =>
          new Promise(async (resolve, reject) => {
            const code = "explicit 3 2";

            context
              .buildViolation("Not unique")
              .atPath(path)
              .setParameter("{{ callback }}", "not equal")
              .setCode(code)
              .setInvalidValue(`xxx`)
              .addViolation();

            if (extra && extra.stop) {
              return reject(new Error("reject " + code));
            }

            resolve("resolve " + code);
          }),
        { async: 2, stop: false }
      ),
    ],
    { errorMode: "errors" } // not specified
  ).then(
    (errors) => {
      done(`Shouldn't happen`);
    },
    (e) => {
      expect(Array.isArray(e)).toEqual(true);

      expect(e.length === 1).toEqual(true);

      expect(e[0] instanceof Error).toEqual(true);

      expect(e[0].name).toEqual("Error");

      expect(String(e[0])).toEqual("Error: reject explicit 3 1");

      done();
    }
  );
});
