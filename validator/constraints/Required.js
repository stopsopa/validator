
const Existence         = require('../prototypes/Existence');

const Constraint         = require('../prototypes/Constraint');

const Required = function (opt, extra) {

    this.cls = 'Required';

    this.setExtra(extra);

    if (opt instanceof Existence) {

        throw `Component passed as an option to Require|Option component can't be another Require or Option componnent`;
    }

    if (opt instanceof Constraint) {

        opt = [opt];
    }

    this.setOptions(opt);
}

Required.prototype = Object.create(Existence.prototype);
Required.prototype.constructor = Required;

Required.prototype.validate = function (value, context) {
    return Promise.resolve('Required');
}

Required.prototype.getChildren = function () {
    return this.getOptions();
}

module.exports = Required;