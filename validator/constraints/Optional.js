
const Existence         = require('../prototypes/Existence');

const Constraint         = require('../prototypes/Constraint');

const Optional = function (opt, extra) {

    this.cls = 'Optional';

    this.setExtra(extra);

    if (opt instanceof Existence) {

        throw `Component passed as an option to Require|Option component can't be another Require or Option componnent`;
    }

    if (opt instanceof Constraint) {

        opt = [opt];
    }

    this.setOptions(opt);
}

Optional.prototype = Object.create(Existence.prototype);
Optional.prototype.constructor = Optional;

Optional.prototype.validate = function (value, context) {
    return Promise.resolve('Optional');
}

Optional.prototype.getChildren = function () {
    return this.getOptions();
}

module.exports = Optional;