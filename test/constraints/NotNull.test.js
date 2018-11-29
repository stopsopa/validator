'use strict';

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

it('NotNull() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: NotNull()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use NotNull() as a function, create instance new NotNull()");
    }
});

it('NotNull - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new NotNull('custom message'));

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
});
it('NotNull - stop [part 1]', async () => {

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
        z: new NotNull(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

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
});
it('NotNull - stop [part 2]', async () => {

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
        z: new NotNull(undefined, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

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
});