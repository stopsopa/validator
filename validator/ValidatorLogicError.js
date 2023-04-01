function ValidatorLogicError() {
  const tmp = Error.apply(this, arguments);
  tmp.name = this.name = "ValidatorLogicError";

  /**
   * To make sure our error will have stack
   * because in case when we do somewhere
   * return Promise.reject(new ValidatorLogicError());
   * then that error will have no stack because it was not thrown
   */
  this.stack = tmp.stack;
  this.message = tmp.message;
}

ValidatorLogicError.prototype = Object.create(Error.prototype);
ValidatorLogicError.prototype.constructor = ValidatorLogicError;

module.exports = ValidatorLogicError;
