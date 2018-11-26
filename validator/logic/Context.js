
const ViolationBuilder = require('./ViolationBuilder');

const Context = function () {

    this.violations = [];

//     $this->context->buildViolation($constraint->message)
// ->setParameter('{{ value }}', $this->formatValue($value))
// ->setCode(IsNull::NOT_NULL_ERROR)
// ->addViolation();
};

Context.prototype.buildViolation = function () {

    let args = Array.prototype.slice.call(arguments);

    if ( args.length === 0 ) {

        throw `new Context(message): message not specified`;
    }

    return new ViolationBuilder(args[0], this);
}
Context.prototype.addViolation = function (path, message, code, invalidValue) {
    this.violations.push([path, message, code, invalidValue]);
};
Context.prototype.getViolations = function () {
    return this.violations;
}

module.exports = Context;