'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../../validator');

const Count         = require('../../validator/constraints/Count');

const Collection    = require('../../validator/constraints/Collection');

const Callback      = require('../../validator/constraints/Callback');

const IsNull        = require('../../validator/constraints/IsNull');

it('Count', () => {

    var k = new Count(4);

    expect(k.errorNames()).toEqual({
        TOO_FEW_ERROR: Count.prototype.TOO_FEW_ERROR,
        TOO_MANY_ERROR: Count.prototype.TOO_MANY_ERROR,
    });
});

it('Count() - used as a function', done => {

    try {
        validator('test', new Collection({
            test: Count()
        }));
    }
    catch (e) {

        expect(e).toBe("It is necessary to use operator 'new' with all constraints");

        done();
    }
});

it('Count - custom message exact', done => {

    return validator(['one', 'two'], new Count(4)).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    undefined,
                    "This collection should contain exactly 4 elements.",
                    "TOO_FEW_ERROR",
                    [
                        "one",
                        "two"
                    ]
                ]
            ]
        );

        done();
    });
});

it('Count - custom message more', done => {

    return validator(['one', 'two'], new Count({
        min: 4,
        max: 5
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    undefined,
                    "This collection should contain 4 elements or more.",
                    "TOO_FEW_ERROR",
                    [
                        "one",
                        "two"
                    ]
                ]
            ]
        );

        done();
    });
});

it('Count - custom message less', done => {

    return validator(['one', 'two'], new Count({
        min: 0,
        max: 1
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    undefined,
                    "This collection should contain 1 element or less.",
                    "TOO_MANY_ERROR",
                    [
                        "one",
                        "two"
                    ]
                ]
            ]
        );

        done();
    });
});

it('Count - no args', done => {

    try {

        validator(['one', 'two'], new Count());
    }
    catch (e) {

        expect(e).toEqual("Count: options must be given for this constraint");

        done()
    }
});

it('Count - wrong arg', done => {

    try {

        validator(['one', 'two'], new Count(false));
    }
    catch (e) {

        expect(e).toEqual("Count: Wrong parameter type have been given to this constraint, typeof: boolean");

        done()
    }
});

it('Count - empty obj arg', done => {

    try {

        validator(['one', 'two'], new Count({}));
    }
    catch (e) {

        expect(e).toEqual("Count: Either option \"min\" or \"max\" must be given for constraint");

        done()
    }
});

it('Count - min not int', done => {

    try {

        validator(['one', 'two'], new Count({min: false}));
    }
    catch (e) {

        expect(e).toEqual("Count: min should be integer");

        done()
    }
});

it('Count - max not int', done => {

    try {

        validator(['one', 'two'], new Count({max: false}));
    }
    catch (e) {

        expect(e).toEqual("Count: max should be integer");

        done()
    }
});

it('Count - min < 0', done => {

    try {

        validator(['one', 'two'], new Count({min: -1}));
    }
    catch (e) {

        expect(e).toEqual("Count: min should be greater than 0");

        done()
    }
});

it('Count - max < 0', done => {

    try {

        validator(['one', 'two'], new Count({max: -1}));
    }
    catch (e) {

        expect(e).toEqual("Count: max should be greater than 0");

        done()
    }
});

it('Count - not object|array', done => {

    return validator(false, new Count({max: 1})).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual([]);

        done()
    });
});

it('Count - object', done => {

    return validator({}, new Count({max: 1})).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual([]);

        done()
    });
});

it('Count - object working', done => {

    return validator({a:'b', c: 'd'}, new Count(2)).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual([]);

        done()
    });
});

it('Count - object working part 2', done => {

    return validator({a:'b', c: 'd'}, new Count({min: 1, max: 2})).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual([]);

        done()
    });
});

it('Count - object working part 3', done => {

    return validator({a:'b', c: 'd'}, new Count({min: 2, max: 2})).then(errors => {


        const raw = errors.getRaw();

        expect(raw).toEqual([]);

        done()
    });
});

it('Count - object working part 4', done => {

    return validator({a:'b', c: 'd'}, new Count({min: 3, max: 4})).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    undefined,
                    "This collection should contain 3 elements or more.",
                    "TOO_FEW_ERROR",
                    {
                        "a": "b",
                        "c": "d"
                    }
                ]
            ]
        );

        done()
    });

});

it('Count - stop [part 1]', done => {

    return validator({
        z: {
            a: 'b',
            c: 'd'
        },
        b: {
            a: ''
        }
    }, new Collection({
        z: new Count({min: 3, max: 4}),
        b: new Collection({
            a: new IsNull(undefined),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This collection should contain 3 elements or more.",
                    "TOO_FEW_ERROR",
                    {
                        "a": "b",
                        "c": "d"
                    }
                ],
                [
                    "b.a",
                    "This value should be null.",
                    "NOT_NULL_ERROR",
                    ""
                ]
            ]
        );

        done();
    });
});

it('Count - stop [part 2]', done => {

    return validator({
        z: {
            a: 'b',
            c: 'd'
        },
        b: {
            a: ''
        }
    }, new Collection({
        z: new Count({min: 3, max: 4}, {async: -1, stop: true}),
        b: new Collection({
            a: new IsNull(undefined),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This collection should contain 3 elements or more.",
                    "TOO_FEW_ERROR",
                    {
                        "a": "b",
                        "c": "d"
                    }
                ],
            ]
        );

        done();
    });
});

it('Count - stop [part 3]', done => {

    return validator({
        z: {
            a: 'b',
            c: 'd'
        },
        b: {
            a: ''
        }
    }, new Collection({
        z: new Count({min: 0, max: 1}, {async: -1, stop: true}),
        b: new Collection({
            a: new IsNull(undefined),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This collection should contain 1 element or less.",
                    "TOO_MANY_ERROR",
                    {
                        "a": "b",
                        "c": "d"
                    }
                ],
            ]
        );

        done();
    });
});

it('Count - stop [part 4]', done => {

    return validator({
        z: {
        },
        b: {
            a: ''
        }
    }, new Collection({
        z: new Count({min: 1, max: 1}, {async: -1, stop: true}),
        b: new Collection({
            a: new IsNull(undefined),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
                    "This collection should contain exactly 1 element.",
                    "TOO_FEW_ERROR",
                    {}
                ],
            ]
        );

        done();
    });
});

it('Count - stop [part 5]', done => {

    return validator({
        z: {
            a: 'b',
            c: 'd',
            d: 'f'
        },
        b: {
            a: ''
        }
    }, new Collection({
        z: new Count({min: 2, max: 2}, {async: -1, stop: true}),
        b: new Collection({
            a: new IsNull(undefined),
        })
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [
                [
                    "z",
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

it('Count - extra is string', done => {

    return validator({
        z: 'abc',
    }, new Collection({
        z: new Callback(
            (value, context, path, extra) =>
                new Promise((resolve, reject) => {

                    if (value.length !== 5) {

                        context
                            .buildViolation(JSON.stringify(extra))
                            .atPath(path)
                            .setCode("CALLBACK_5")
                            .setInvalidValue(value)
                            .addViolation()
                        ;

                        if (extra && extra.stop) {

                            return reject('reject Callback_5');
                        }
                    }

                    resolve('resolve Callback_5');
                }),
            'extrastring'
        )
    })).then(errors => {

        const raw = errors.getRaw();

        expect(raw).toEqual(
            [["z", "\"extrastring\"", "CALLBACK_5", "abc"]]
        );

        done();
    });
});