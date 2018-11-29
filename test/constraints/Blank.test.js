'use strict';

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

it('Blank() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: Blank()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use Blank() as a function, create instance new Blank()");
    }
});

it('Blank - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new Blank('custom message'));

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
});
it('Blank - stop [part 1]', async () => {

    expect.assertions(1);

    let errors = await validator({
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
    }));

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
});
it('Blank - stop [part 2]', async () => {

    expect.assertions(1);

    let errors = await validator({
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
    }));

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
});
it('Blank - not empty array', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: ['test']
    }, new Collection({
        z: new Blank(),
    }));

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
});
it('Blank - not empty object', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: {test:'test'}
    }, new Collection({
        z: new Blank(),
    }));

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
});