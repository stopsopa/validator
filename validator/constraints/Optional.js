
'use strict';

const Existence         = require('../prototypes/Existence');

const Constraint         = require('../prototypes/Constraint');

const isObject           = require('../utils/isObject');

const Optional = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    if ( isObject(extra) ) {

        if ( extra instanceof Existence ) {

            throw new Error(`Optional: extra can't be instance of Existence`);
        }

        if ( extra instanceof Constraint ) {

            throw new Error(`Optional: extra can't be instance of Constraint`);
        }
    }

    this.setExtra(extra);

    this.setOptions(opt);
}

Optional.prototype = Object.create(Existence.prototype);
Optional.prototype.constructor = Optional;

module.exports = Optional;