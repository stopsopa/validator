'use strict';

try {require("karma_jest_shim")}catch(e){}

const validator     = require('../../validator');

const IsNull = require('../../validator/constraints/IsNull');

const Length = require('../../validator/constraints/Length');

it('Length - error types', () => {

    var k = new Length(3);

    expect(k.errorNames()).toEqual({
        TOO_SHORT_ERROR : Length.prototype.TOO_SHORT_ERROR,
        TOO_LONG_ERROR  : Length.prototype.TOO_LONG_ERROR,
    });
});

it('Length - no arg', done => {

    try {

        const k = new Length();
    }
    catch (e) {

        expect(e + '').toBe("Length: options must be given for this constraint");

        done();
    }
});

it('Length - wrong arg type', done => {

    try {

        const k = new Length(false);
    }
    catch (e) {

        expect(e + '').toBe("Length: Wrong parameter type have been given to this constraint, typeof: boolean");

        done();
    }
});

it('Length - no min & no max', done => {

    try {

        const k = new Length({});
    }
    catch (e) {

        expect(e + '').toBe("Length: Either option \"min\" or \"max\" must be given for constraint");

        done()
    }
});