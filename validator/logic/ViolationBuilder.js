
const ViolationBuilder = function (message, context) {
    this.parameters     = {};
    this.code           = undefined;
    this.path           = undefined;
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
ViolationBuilder.prototype.setInvalidValue = function (invalidValue) {

    this.invalidValue = invalidValue;

    return this;
}
ViolationBuilder.prototype.addViolation = function() {

    if ( this.code === undefined ) {

        throw `ViolationBuilder: this.code === undefined, call ViolationBuilder->setCode(code)`;
    }

    if ( this.path === undefined ) {

        throw `ViolationBuilder: this.path === undefined, call ViolationBuilder->atPath(path)`;
    }

    let message = this.message;

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