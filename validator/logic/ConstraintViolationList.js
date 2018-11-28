
function ConstraintViolationList (violations) {

    this.violations = violations || [];
}

ConstraintViolationList.prototype.FORMAT_RAW    = 'FORMAT_RAW';
ConstraintViolationList.prototype.FORMAT_FLAT   = 'FORMAT_FLAT';
ConstraintViolationList.prototype.FORMAT_LIST   = 'FORMAT_LIST';

ConstraintViolationList.prototype.findByCodes = function (code, format) {

    switch (format) {
        case ConstraintViolationList.prototype.FORMAT_FLAT:

            break;
        case ConstraintViolationList.prototype.FORMAT_LIST:

            break;
        default:


            break;
    }
}

ConstraintViolationList.prototype.getRaw = function () {
    return this.violations;
}

module.exports = ConstraintViolationList;