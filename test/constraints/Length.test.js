'use strict';

const validator     = require('../../validator');

const IsNull = require('../../validator/constraints/IsNull');

const Length = require('../../validator/constraints/Length');

it('Length - error types', () => {

    expect.assertions(1);

    var k = new Length(3);

    expect(k.errorNames()).toEqual({
        TOO_SHORT_ERROR : Length.prototype.TOO_SHORT_ERROR,
        TOO_LONG_ERROR  : Length.prototype.TOO_LONG_ERROR,
    });
});

it('Length - no arg', () => {

    expect.assertions(1);

    try {

        const k = new Length();
    }
    catch (e) {

        expect(e + '').toBe("Length: options must be given for this constraint");
    }
});

it('Length - wrong arg type', () => {

    expect.assertions(1);

    try {

        const k = new Length(false);
    }
    catch (e) {

        expect(e + '').toBe("Length: Wrong parameter type have been given to this constraint, typeof: boolean");
    }
});

it('Length - no min & no max', () => {

    expect.assertions(1);

    try {

        const k = new Length({});
    }
    catch (e) {

        expect(e + '').toBe("Length: Either option \"min\" or \"max\" must be given for constraint");
    }
});