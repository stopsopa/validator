'use strict';

try {require("karma_jest_shim")}catch(e){}

const validator     = require('../../validator');

const NotNull        = require('../../validator/constraints/NotNull');

const Count         = require('../../validator/constraints/Count');

const Collection    = require('../../validator/constraints/Collection');

it('NotNull', () => {

    var k = new NotNull();

    expect(k.errorNames()).toEqual({
        IS_NULL_ERROR: NotNull.prototype.IS_NULL_ERROR
    });
});

it('NotNull() - used as a function', done => {

    try {
        validator('test', new Collection({
            test: NotNull()
        }));
    }
    catch (e) {

        expect(e + '').toBe("Don't use NotNull() as a function, create instance new NotNull()");

        done();
    }
});

it('NotNull - custom message', done => {

    return validator('test', new NotNull('custom message')).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    undefined,
                    "custom message",
                    "IS_NULL_ERROR",
                    "test"
                ]
            ]
        );

        done();
    });
});
it('NotNull - stop [part 1]', done => {

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
        z: new NotNull(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "his value should be true.",
                    "IS_NULL_ERROR",
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
it('NotNull - stop [part 2]', done => {

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
        z: new NotNull(undefined, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "his value should be true.",
                    "IS_NULL_ERROR",
                    false
                ]
            ]
        );

        done();
    });
});