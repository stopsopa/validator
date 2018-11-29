'use strict';

const validator     = require('../../validator');

const IsFalse        = require('../../validator/constraints/IsFalse');

const Count         = require('../../validator/constraints/Count');

const Collection    = require('../../validator/constraints/Collection');

it('IsFalse', () => {

    var k = new IsFalse();

    expect(k.errorNames()).toEqual({
        NOT_FALSE_ERROR: IsFalse.prototype.NOT_FALSE_ERROR
    });
});

it('IsFalse() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: IsFalse()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use IsFalse() as a function, create instance new IsFalse()");
    }
});

it('IsFalse - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new IsFalse('custom message'));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "custom message",
                "NOT_FALSE_ERROR",
                "test"
            ]
        ]
    );
});
it('IsFalse - stop [part 1]', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: true,
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new IsFalse(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "z",
                "This value should be false.",
                "NOT_FALSE_ERROR",
                true
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
it('IsFalse - stop [part 2]', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: true,
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new IsFalse(undefined, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "z",
                "This value should be false.",
                "NOT_FALSE_ERROR",
                true
            ]
        ]
    );
});