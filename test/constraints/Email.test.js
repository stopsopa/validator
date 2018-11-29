'use strict';

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

it('Email() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: Email()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use Email() as a function, create instance new Email()");
    }
});

it('Email - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new Email('custom message'));

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
});
it('Email - stop [part 1]', async () => {

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
        z: new Email(),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

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
});
it('Email - stop [part 2]', async () => {

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
        z: new Email(undefined, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

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
});