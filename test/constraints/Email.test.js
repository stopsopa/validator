'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../../validator');

const Email        = require('../../validator/constraints/Email');

const Count         = require('../../validator/constraints/Count');

const Collection    = require('../../validator/constraints/Collection');

it('Email', () => {

    var k = new Email();

    expect(k.errorNames()).toEqual({
        INVALID_EMAIL_ERROR: Email.prototype.INVALID_EMAIL_ERROR
    });
});

it('Email() - used as a function', done => {

    try {

        validator('test', new Collection({
            test: Email()
        }))
    }
    catch (e) {

        expect(String(e)).toBe("It is necessary to use operator 'new' with all constraints");

        done();
    }
});

it('Email - custom message', done => {

    return validator('test', new Email('custom message')).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    undefined,
                    "custom message",
                    "INVALID_EMAIL_ERROR",
                    "test"
                ]
            ]
        );

        done();
    });
});
it('Email - stop [part 1]', done => {

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
        z: new Email(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value is not a valid email address.",
                    "INVALID_EMAIL_ERROR",
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
it('Email - stop [part 2]', done => {

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
        z: new Email(undefined, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value is not a valid email address.",
                    "INVALID_EMAIL_ERROR",
                    false
                ]
            ]
        );

        done();
    });
});

it('Email - valid', done => {

    return validator({
        z: 'valid@mail.com',
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Email(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [["b.a", "This collection should contain exactly 2 elements.", "TOO_MANY_ERROR", {"a": "b", "c": "d", "d": "f"}]]
        );

        done();
    });
});
