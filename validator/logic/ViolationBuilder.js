
'use strict';

const ViolationBuilder = function (message, context) {
    this.parameters     = {};
    this.code           = undefined;
    this.path           = undefined;
    this.plural         = false;
    this.invalidValue   = undefined;
    this.message        = message;
    this.context        = context;
}
ViolationBuilder.prototype.setParameter = function (name, value) {

    this.parameters[name] = value;

    return this;
}
ViolationBuilder.prototype.setCode = function (code) {

    this.code = code;

    return this;
}
ViolationBuilder.prototype.atPath = function (path) {

    this.path = path;

    return this;
}
ViolationBuilder.prototype.setPlural = function (plural) {

    if ( ! Number.isInteger(plural) || plural < 0 ) {

        throw `ViolationBuilder.setPlural(plural) - plural parameter should be integer in range 0-inifinty`
    }

    this.plural = plural;

    return this;
}
ViolationBuilder.prototype.setInvalidValue = function (invalidValue) {

    this.invalidValue = invalidValue;

    return this;
}
ViolationBuilder.prototype.addViolation = function() {

    if ( this.code === undefined ) {

        throw `ViolationBuilder: this.code === undefined, call ViolationBuilder->setCode(code)`;
    }

    let message = this.message;

    if (typeof message === 'string' && message.indexOf('|') > -1 && this.plural !== false && this.plural > -1) {

        const split = message.split('|');

        if (split.length > this.plural) {

            message = split[this.plural];
        }
    }

    Object.keys(this.parameters).map(key => {

        let cp;

        do {

            cp = message;

            message = message.replace(key, this.parameters[key]);

        } while (cp !== message);
    });

    this.context.addViolation(
        this.path,
        message,
        this.code,
        this.invalidValue
    );

    return this;
}

module.exports = ViolationBuilder;