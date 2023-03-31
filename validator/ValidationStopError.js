function ValidationStopError() {
  Error.apply(this, arguments)
  this.name = "ValidationStopError";
}

ValidationStopError.prototype = Object.create(Error.prototype);
ValidationStopError.prototype.constructor = ValidationStopError;

module.exports = ValidationStopError;
