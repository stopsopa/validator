'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../../validator');

const Regex        = require('../../validator/constraints/Regex');

const Count         = require('../../validator/constraints/Count');

const Collection    = require('../../validator/constraints/Collection');

it('Regex', () => {

    expect(Regex.prototype.errorNames()).toEqual({
        REGEX_FAILED_ERROR: Regex.prototype.REGEX_FAILED_ERROR
    });
});

it('Regex() - used as a function', done => {

    try {
        validator('test', new Collection({
            test: Regex()
        }));
    }
    catch (e) {

        expect(String(e)).toBe("It is necessary to use operator 'new' with all constraints");

        done();
    }
});

it('Regex - wrong arg', done => {

    try {

        validator('test', new Regex('custom message'));
    }
    catch (e) {

        expect(e).toEqual("Regex: first argument must be regex or object");

        done();
    }
});

it('Regex - no regex given', done => {

    try {

        validator('test', new Regex({
            message: 'custom message'
        }));
    }
    catch (e) {

        expect(e).toEqual("Regex: 'pattern' is not specified");

        done()
    }
});

it('Regex - custom message', done => {

    return validator({
        a: 'startmidleend'
    }, new Collection({
        a: new Regex({
            message: 'custom message',
            pattern: /middle/
        })
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "a",
                    "custom message",
                    "REGEX_FAILED_ERROR",
                    "startmidleend"
                ]
            ]
        );

        done();
    });
});

it('Regex - match: true, valid', done => {

    return validator({
        a: 'startmiddleend'
    }, new Collection({
        a: new Regex(/middle/)
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual([]);

        done();
    });
});

it('Regex - match: true, invalid', done => {

    return validator({
        a: 'startmidleend'
    }, new Collection({
        a: new Regex(/middle/)
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "a",
                    "This value is not valid.",
                    "REGEX_FAILED_ERROR",
                    "startmidleend"
                ]
            ]
        );

        done();
    });
});


it('Regex - match: false, valid', done => {

    return validator({
        a: 'startmiddleend'
    }, new Collection({
        a: new Regex({
            pattern: /middle/,
            match: false,
        })
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "a",
                    "This value is not valid.",
                    "REGEX_FAILED_ERROR",
                    "startmiddleend"
                ]
            ]
        );

        done();
    });
});

it('Regex - match: true, invalid', done => {

    return validator({
        a: 'startmidleend'
    }, new Collection({
        a: new Regex({
            pattern: /middle/,
            match: false,
        })
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual([]);

        done();
    });
});

it('Regex - stop [part 1]', done => {

    return validator({
        z: 'onetothree',
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Regex(/two/),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value is not valid.",
                    "REGEX_FAILED_ERROR",
                    "onetothree"
                ],
                [
                    "b.a",
                    "This collection should contain exactly 2 elements.",
                    "TOO_MANY_ERROR",
                    {
                        "a": "b",
                        "c": "d",
                        "d": "f"
                    }
                ]
            ]
        );

        done();
    });
});


it('Regex - stop [part 2]', done => {

    return validator({
        z: 'onetothree',
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Regex(/two/, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value is not valid.",
                    "REGEX_FAILED_ERROR",
                    "onetothree"
                ]
            ]
        );

        done();
    });
});

it('Regex - not string value', done => {

    return validator({
        z: false,
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Regex(/two/),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value is not valid.",
                    "REGEX_FAILED_ERROR",
                    false
                ],
                [
                    "b.a",
                    "This collection should contain exactly 2 elements.",
                    "TOO_MANY_ERROR",
                    {
                        "a": "b",
                        "c": "d",
                        "d": "f"
                    }
                ]
            ]
        );

        done();
    });
});

it('Regex - number', done => {

    return validator(87, new Regex(/^\d+$/)).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual([]);

        done();
    });
});

it('Regex - minus number', done => {

    return validator(-87, new Regex(/^\d+$/)).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual([[undefined, "This value is not valid.", "REGEX_FAILED_ERROR", -87]]);

        done();
    });
});
