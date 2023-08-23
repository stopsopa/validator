"use strict";



const validator = require("../../validator");

const Context = require("../../validator/logic/Context");

const Callback = require("../../validator/constraints/Callback");

const All = require("../../validator/constraints/All");

it("new Context().buildViolation() ", (done) => {
  try {
    new Context().buildViolation();
  } catch (e) {
    expect(String(e)).toBe("Error: new Context(message).buildViolation(message): message not specified");

    done();
  }
});

it("new Context().buildViolation(false) ", (done) => {
  try {
    new Context().buildViolation(false);
  } catch (e) {
    expect(String(e)).toBe("Error: new Context(message).buildViolation(message): message arg must be string");

    done();
  }
});

it("new Constraint().getExtra() ", (done) => {
  validator(
    ["test"],
    new All(
      new Callback(
        (value, context, path, extra) =>
          new Promise((resolve, reject) => {
            if (value.length !== 5) {
              context
                .buildViolation(JSON.stringify(extra))
                .atPath(path)
                // .setParameter('{{ callback }}', 'not equal')
                .setCode("CALLBACK_5")
                .setInvalidValue(value)
                .addViolation();

              if (extra.stop) {
                return reject("reject Callback_5");
              }
            }

            resolve("resolve Callback_5");
          }),
        {
          extra: "callback",
        }
      )
    ),
    {
      extra: "context",
    }
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["0", '{"extra":"callback"}', "CALLBACK_5", "test"]]);

      done();
    },
    (e) => done({ e })
  );
});

it("new Context().getExtra() ", (done) => {
  validator(
    ["test"],
    new All(
      new Callback(
        (value, context, path, extra) =>
          new Promise((resolve, reject) => {
            if (value.length !== 5) {
              context
                .buildViolation(JSON.stringify(context.getExtra()))
                .atPath(path)
                // .setParameter('{{ callback }}', 'not equal')
                .setCode("CALLBACK_5")
                .setInvalidValue(value)
                .addViolation();

              if (extra.stop) {
                return reject("reject Callback_5");
              }
            }

            resolve("resolve Callback_5");
          }),
        {
          extra: "callback",
        }
      )
    ),
    {
      extra: "context",
    }
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["0", '{"extra":"context"}', "CALLBACK_5", "test"]]);

      done();
    },
    (e) => done({ e })
  );
});

it("new Context().getRoot() ", (done) => {
  validator(
    ["test"],
    new All(
      new Callback(
        (value, context, path, extra) =>
          new Promise((resolve, reject) => {
            if (value.length !== 5) {
              context
                .buildViolation(JSON.stringify(context.getRoot()))
                .atPath(path)
                .setCode("CALLBACK_5")
                .setInvalidValue(value)
                .addViolation();

              if (extra.stop) {
                return reject("reject Callback_5");
              }
            }

            resolve("resolve Callback_5");
          }),
        {
          extra: "callback",
        }
      )
    ),
    {
      extra: "context",
    }
  ).then(
    (errors) => {
      const raw = errors.getRaw();

      expect(raw).toEqual([["0", '["test"]', "CALLBACK_5", "test"]]);

      done();
    },
    (e) => done({ e })
  );
});
