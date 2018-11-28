
const ViolationBuilder          = require('./ViolationBuilder');

const ConstraintViolationList   = require('../logic/ConstraintViolationList');

const Context = function (rootData, extra = {}) {

    this.violations = [];

    this.rootData   = rootData;

    this.extra      = extra || {};

    this.stack      = {};
};

Context.prototype.buildViolation = function () {

    let args = Array.prototype.slice.call(arguments);

    if ( args.length === 0 ) {

        throw `new Context(message).buildViolation(message): message not specified`;
    }

    if (typeof args[0] !== 'string') {

        throw `new Context(message).buildViolation(message): message arg must be string`;
    }

    return new ViolationBuilder(args[0] + '', this);
}
Context.prototype.addViolation = function (path, message, code, invalidValue) {
    this.violations.push([path, message, code, invalidValue]);
};
Context.prototype.addTrigger = function (async = 0, trigger) {

    if ( ! this.stack[async] ) {

        this.stack[async] = [];
    }

    this.stack[async].push(trigger);

    return this;
}
Context.prototype.getTriggers = function () {

    const list = Object.keys(this.stack).sort().reduce((acc, key) => {

        this.stack[key].length && acc.push(this.stack[key]);

        return acc;
    }, []);

    this.stack = {};

    return list;
}
Context.prototype.getViolations = function () {
    return new ConstraintViolationList(this.violations);
}
Context.prototype.getRoot = function () {
    return this.rootData;
}
Context.prototype.getExtra = function () {
    return this.extra || {};
}

module.exports = Context;