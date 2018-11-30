'use strict';

try {require("karma_jest_shim")}catch(e){}

const validator     = require('../../validator');

const Blank        = require('../../validator/constraints/Blank');

const Count         = require('../../validator/constraints/Count');

const Collection    = require('../../validator/constraints/Collection');

it('Blank', () => {

    var k = new Blank();

    expect(k.errorNames()).toEqual({
        NOT_BLANK_ERROR: Blank.prototype.NOT_BLANK_ERROR
    });
});

it('Blank() - used as a function', done => {

    try {

        validator('test', new Collection({
            test: Blank()
        }))
    }
    catch (e) {

        expect(e + '').toBe("Don't use Blank() as a function, create instance new Blank()");
        done();
    }
});

it('Blank - custom message', done => {

    return validator('test', new Blank('custom message')).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    undefined,
                    "custom message",
                    "NOT_BLANK_ERROR",
                    "test"
                ]
            ]
        );

        done()
    });

});
it('Blank - stop [part 1]', done => {

    return validator({
        z: 'string',
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Blank(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value should be blank.",
                    "NOT_BLANK_ERROR",
                    "string"
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
it('Blank - stop [part 2]', done => {

    return validator({
        z: '0d',
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Blank(null, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value should be blank.",
                    "NOT_BLANK_ERROR",
                    "0d"
                ]
            ]
        );

        done()
    });
});
it('Blank - not empty array', done => {

    return validator({
        z: ['test']
    }, new Collection({
        z: new Blank(),
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value should be blank.",
                    "NOT_BLANK_ERROR",
                    ['test']
                ]
            ]
        );

        done()
    });

});
it('Blank - not empty object', done => {

    return validator({
        z: {test:'test'}
    }, new Collection({
        z: new Blank(),
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This value should be blank.",
                    "NOT_BLANK_ERROR",
                    {test: 'test'}
                ]
            ]
        );

        done();
    });
});