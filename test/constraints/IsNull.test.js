'use strict';

const validator     = require('../../validator');

const IsNull = require('../../validator/constraints/IsNull');

const Count         = require('../../validator/constraints/Count');

const Collection = require('../../validator/constraints/Collection');

it('IsNull', () => {

    var k = new IsNull();

    expect(k.errorNames()).toEqual({
        NOT_NULL_ERROR: IsNull.prototype.NOT_NULL_ERROR
    });
});

it('IsNull() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: IsNull()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use IsNull() as a function, create instance new IsNull()");
    }
});

it('IsNull - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new IsNull('custom message'));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "custom message",
                "NOT_NULL_ERROR",
                "test"
            ]
        ]
    );
});


it('IsNull - stop [part 1]', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: false,
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new IsNull(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "z",
                "This value should be null.",
                "NOT_NULL_ERROR",
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
});
it('IsNull - stop [part 2]', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: false,
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new IsNull(undefined, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "z",
                "This value should be null.",
                "NOT_NULL_ERROR",
                false
            ]
        ]
    );
});