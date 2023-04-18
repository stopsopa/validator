"use strict";

const Existence = require("../prototypes/Existence");

const Constraint = require("../prototypes/Constraint");

const All = require("../constraints/All");

const isArray = require("../utils/isArray");

const each = require("../utils/each");

const connectAndSort = function ({ value, constraints, context, path, final = false }) {
  if (constraints instanceof Existence) {
    return connectAndSort({
      value,
      constraints: constraints.getOptions(),
      context,
      path,
      final,
    });
  }

  if (constraints instanceof Constraint) {
    constraints = [constraints];
  }

  if (!isArray(constraints)) {
    if (final) {
      return context.getTriggers();
    }

    return;
  }

  for (let i = 0, l = constraints.length; i < l; i += 1) {
    if (constraints[i] instanceof Existence) {
      connectAndSort({
        value,
        constraints: constraints[i].getOptions(),
        context,
        path,
      });
    } else if (constraints[i] instanceof All) {
      const combine = path ? (name) => path + "." + name : (name) => name;

      const allConstraints = constraints[i].getOptions();

      each(value, (v, name) => {
        connectAndSort({
          value: v,
          constraints: allConstraints,
          context,
          path: combine(name),
        });
      });
    } else {
      (function (extra) {
        context.addTrigger(extra ? extra.async : 0, () => constraints[i].validate(value, context, path, extra));
      })(constraints[i].getExtra());

      if (constraints[i].validateChildren) {
        (function (extra) {
          constraints[i].validateChildren(value, context, path, extra);
        })(constraints[i].getExtra());
      }
    }
  }

  if (final) {
    return context.getTriggers();
  }
};

module.exports = connectAndSort;
