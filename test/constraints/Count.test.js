'use strict';

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

it('Count() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: Count()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use Count() as a function, create instance new Count()");
    }
});

it('Count - custom message exact', async () => {

    expect.assertions(1);

    let errors = await validator(['one', 'two'], new Count(4));

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
});

it('Count - custom message more', async () => {

    expect.assertions(1);

    let errors = await validator(['one', 'two'], new Count({
        min: 4,
        max: 5
    }));

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
});

it('Count - custom message less', async () => {

    expect.assertions(1);

    let errors = await validator(['one', 'two'], new Count({
        min: 0,
        max: 1
    }));

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
});

it('Count - no args', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(['one', 'two'], new Count());
    }
    catch (e) {
        expect(e).toEqual("Count: options must be given for this constraint");
    }
});

it('Count - wrong arg', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(['one', 'two'], new Count(false));
    }
    catch (e) {
        expect(e).toEqual("Count: Wrong parameter type have been given to this constraint, typeof: boolean");
    }
});

it('Count - empty obj arg', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(['one', 'two'], new Count({}));
    }
    catch (e) {
        expect(e).toEqual("Count: Either option \"min\" or \"max\" must be given for constraint");
    }
});

it('Count - min not int', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(['one', 'two'], new Count({min: false}));
    }
    catch (e) {
        expect(e).toEqual("Count: min should be integer");
    }
});

it('Count - max not int', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(['one', 'two'], new Count({max: false}));
    }
    catch (e) {
        expect(e).toEqual("Count: max should be integer");
    }
});

it('Count - min < 0', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(['one', 'two'], new Count({min: -1}));
    }
    catch (e) {
        expect(e).toEqual("Count: min should be greater than 0");
    }
});

it('Count - max < 0', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(['one', 'two'], new Count({max: -1}));
    }
    catch (e) {
        expect(e).toEqual("Count: max should be greater than 0");
    }
});

it('Count - not object|array', async () => {

    expect.assertions(1);

    let errors = await validator(false, new Count({max: 1}));

    const raw = errors.getRaw();

    expect(raw).toEqual([]);
});

it('Count - object', async () => {

    expect.assertions(1);

    let errors = await validator({}, new Count({max: 1}));

    const raw = errors.getRaw();

    expect(raw).toEqual([]);
});

it('Count - object working', async () => {

    expect.assertions(1);

    let errors = await validator({a:'b', c: 'd'}, new Count(2));

    const raw = errors.getRaw();

    expect(raw).toEqual([]);
});

it('Count - object working part 2', async () => {

    expect.assertions(1);

    let errors = await validator({a:'b', c: 'd'}, new Count({min: 1, max: 2}));

    const raw = errors.getRaw();

    expect(raw).toEqual([]);
});

it('Count - object working part 3', async () => {

    expect.assertions(1);

    let errors = await validator({a:'b', c: 'd'}, new Count({min: 2, max: 2}));

    const raw = errors.getRaw();

    expect(raw).toEqual([]);
});

it('Count - object working part 4', async () => {

    expect.assertions(1);

    let errors = await validator({a:'b', c: 'd'}, new Count({min: 3, max: 4}));

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
});

it('Count - stop [part 1]', async () => {

    expect.assertions(1);

    let errors = await validator({
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
    }));

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
});

it('Count - stop [part 2]', async () => {

    expect.assertions(1);

    let errors = await validator({
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
    }));

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
});

it('Count - stop [part 3]', async () => {

    expect.assertions(1);

    let errors = await validator({
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
    }));

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
});

it('Count - stop [part 4]', async () => {

    expect.assertions(1);

    let errors = await validator({
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
    }));

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
});

it('Count - stop [part 5]', async () => {

    expect.assertions(1);

    let errors = await validator({
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
    }));

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
});

it('Count - extra is string', async () => {

    expect.assertions(1);

    let errors = await validator({
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

                        if (extra.stop) {

                            return reject('reject Callback_5');
                        }
                    }

                    resolve('resolve Callback_5');
                }),
            'extrastring'
        )
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [["z", "\"extrastring\"", "CALLBACK_5", "abc"]]
    );
});