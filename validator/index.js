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
   * 'exceptionalThrow' (default) -
   *
   * 'justStop' - this will return list like in success mode (list of violations) as resolved promise
   *          the only side effect will be that it will not execute next promiseall
   *          (this was old default behaviour)
   *          next promiseall will not be triggered
   *
   * 'raw' - just raw list of results from last promiseall as rejected promise
   *          next promiseall will not be triggered
   *
   * 'errors' - just error from last result of last promiseall as rejected promise
   *          if last list have other resolved=true then those will be filtered out
   *          next promiseall will not be triggered
   *
   * 'firstError' - return first error and don't run next promiseall as rejected promise
   *          next promiseall will not be triggered
   *
   * NOTICE:
   *
   *  Generally all above options (including default 'first') will stop processing next promiseall
   *  and result in rejected promise in case when any Callback validator return rejected promise.
   *
   *  If you wish to run all promiseall then simply don't throw any errors from any defined Callback validator
   */

  return promise.then(end, (e) => {
    /**
     * This catch generally means that something really returned rejected promise
     * and it needs to be handled somehow.
     * Another thing that could also happen is not triggering "next" promiseall.
     * Either way this block defines what should happen next.
     *
     * By default (in case of mode 'exceptionalThrow') this block will just return violations using end() internal function
     * or throw when Callback type validators throws at least one ValidatorLogicError type error.
     * In that case first error of this type will be rethrown.
     */
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
