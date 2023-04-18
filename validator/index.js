"use strict";

const Context = require("./logic/Context");

const connectAndSort = require("./logic/connectAndSort");

const delay = require("./utils/delay");

const promiseall = require("nlab/promiseall");

const ValidatorLogicError = require("./ValidatorLogicError");

// const log               = require('../log/logn');

/**
 * import validator, { test } from '@stopsopa/validator';
 *
 * @param data
 * @param constraints
 * @param options
 * @returns {string}
 */

const modes = {
  exceptionalThrow: "exceptionalThrow",
  justStop: "justStop",
  raw: "raw",
  errors: "errors",
  firstError: "firstError",
};

const modesList = Object.keys(modes);

const validator = (value, constraints, extra, debug) => {
  const errorMode = extra && typeof extra.errorMode === "string" ? extra.errorMode : modes.exceptionalThrow;

  if (!modesList.includes(errorMode)) {
    throw new Error(
      `@stopsopa/validator errorMode should be one of [${modesList.join(", ")}] but it is '${errorMode}'`
    );
  }

  const context = new Context(value, extra);

  const connected = connectAndSort({
    value,
    constraints,
    context,
    path: extra ? extra.path : undefined,
    final: true,
  });

  let promise = Promise.resolve();

  while (connected.length) {
    (function (list) {
      promise = promise.then(() => promiseall(list.map((c) => c())));

      if (debug > 1) {
        promise = promise.then(...delay.then(2500));
      }

      if (debug > 0) {
        promise = promise.then(
          (a) => {
            console.log("debug resolved:", JSON.stringify(a));
            return a;
          },
          (a) => {
            console.log("debug rejected:", JSON.stringify(a));
            return Promise.reject(a);
          }
        );
      }
    })(connected.shift());
  }

  const end = () => context.getViolations();

  /**
   * Other modes are:
   *
   * 'raw'    - will return all promises of the all executed promiseall's if any promise in all promiseall groups will be rejected
   *          - next promiseall will not be triggered
   *          - will result in validator() returning rejected promise
   *
   * 'errors' - will extract just error payloads from rejected promises of the all executed promiseall's
   *          - all resolved promises will be filtered out
   *          - next promiseall will not be triggered
   *          - will result in validator() returning rejected promise
   *
   * 'firstError' - the same as above but it will return just first error from the list above
   *          next promiseall will not be triggered
   *
   * 'justStop' - this will make validator() always return resolved promise
   *            - turning "stop" flag for any validator which will result in rejected promise in any promiseall will only cause
   *              not triggering next batch of promiseall, but all errors generated by all executed promiseall will be still gathered
   *            - NOTICE: this is how this entire library worked before introducing ValidatorLogicError error type
   *
   * 'exceptionalThrow' (default) - in case of detecting any ValidatorLogicError the first one found will be returned
   *          - next promiseall will not be triggered
   *          - will result in validator() returning rejected promise
   *
   * NOTICE:
   *
   *  If you wish to run all promiseall then simply don't use extra "stop" flag, or don't throw ValidatorLogicError in callbacks
   */

  return promise.then(end, (e) => {
    try {
      if (errorMode === modes.justStop) {
        return end();
      }

      if (errorMode === modes.raw) {
        return Promise.reject(e);
      }

      /**
       * Filtering out resolved=false states and normalizing them to errors
       */
      let errors = e
        .filter((e) => e.resolved === false)
        .map((e) => {
          if (e.data instanceof Error) {
            return e.data;
          }

          return new Error(String(e.data));
        });

      const exceptionalThrow = errors.find((e) => e instanceof ValidatorLogicError);

      if (errorMode === modes.exceptionalThrow && exceptionalThrow) {
        return Promise.reject(exceptionalThrow);
      }

      if (errorMode === modes.errors) {
        return Promise.reject(errors);
      }

      let firstError = errors.shift();

      if (errorMode === modes.firstError && firstError) {
        return Promise.reject(firstError);
      }

      return end();
    } catch (e) {
      return Promise.reject(e);
    }
  });
};

validator.Required = require("./constraints/Required");
validator.Optional = require("./constraints/Optional");
validator.Collection = require("./constraints/Collection");
validator.All = require("./constraints/All");
validator.Blank = require("./constraints/Blank");
validator.Callback = require("./constraints/Callback");
validator.Choice = require("./constraints/Choice");
validator.Count = require("./constraints/Count");
validator.Email = require("./constraints/Email");
validator.IsFalse = require("./constraints/IsFalse");
validator.IsNull = require("./constraints/IsNull");
validator.IsTrue = require("./constraints/IsTrue");
validator.Length = require("./constraints/Length");
validator.NotBlank = require("./constraints/NotBlank");
validator.NotNull = require("./constraints/NotNull");
validator.Regex = require("./constraints/Regex");
validator.Type = require("./constraints/Type");

validator.ValidatorLogicError = ValidatorLogicError;

module.exports = validator;
