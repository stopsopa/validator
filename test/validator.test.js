
'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../validator');

const Collection    = require('../validator/constraints/Collection');

const Required      = require('../validator/constraints/Required');

const Optional      = require('../validator/constraints/Optional');

const Length        = require('../validator/constraints/Length');

const IsNull        = require('../validator/constraints/IsNull');

const Context       = require('../validator/logic/Context');

it('validator', done => {

    return validator('test', new IsNull()).then(errors => {

        errors = errors.getRaw();

        expect(
            JSON.stringify(
                errors
            )
        ).toBe(
            JSON.stringify(
                [
                    [
                        null,
                        "This value should be null.",
                        IsNull.prototype.NOT_NULL_ERROR,
                        'test',
                    ]
                ]
            )
        );

        done();
    });
});
it('context message not specified', done => {

    try {

        const context = new Context();

        context.buildViolation();
    }
    catch (e) {

        expect((e + '')).toBe("new Context(message).buildViolation(message): message not specified");

        done();
    }
});
it('validator', done => {

    return validator('test', [
        new IsNull(),
        new Length(3),
    ]).then(errors => {

        errors = errors.getRaw();

        expect(
            JSON.stringify(
                errors
            )
        ).toBe(
            JSON.stringify(
                [
                    [
                        null,
                        "This value should be null.",
                        IsNull.prototype.NOT_NULL_ERROR,
                        "test"
                    ],
                    [
                        null,
                        "This value should have exactly 3 characters.",
                        Length.prototype.TOO_LONG_ERROR,
                        "test"
                    ]
                ]
            )
        );

        done();
    });
});
it('groups', done => {

    return validator('test', [
        new IsNull({
            async: -20,
        }),
        new Length({
            min: 3,
            max: 3,
            async: 10,
        }),
    ]).then(errors => {

        errors = errors.getRaw();

        expect(
            JSON.stringify(
                errors
            )
        ).toBe(
            JSON.stringify(
                [
                    [
                        null,
                        "This value should be null.",
                        IsNull.prototype.NOT_NULL_ERROR,
                        "test"
                    ],
                    [
                        null,
                        "This value should have exactly 3 characters.",
                        Length.prototype.TOO_LONG_ERROR,
                        "test"
                    ]
                ]
            )
        );

        done();
    });
});

it('debug', done => {

    return validator('test', [
        new IsNull(),
    ], undefined, 2).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    undefined,
                    "This value should be null.",
                    "NOT_NULL_ERROR",
                    "test"
                ]
            ]
        );

        done();
    });
});


it('false', done => {

    return validator('test', [
        new IsNull(undefined, {
            stop: 1
        }),
    ], undefined, 2).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    undefined,
                    "This value should be null.",
                    "NOT_NULL_ERROR",
                    "test"
                ]
            ]
        );

        done();
    });
});

