'use strict';

const validator     = require('../../validator');

const Regex        = require('../../validator/constraints/Regex');

const Count         = require('../../validator/constraints/Count');

const Collection    = require('../../validator/constraints/Collection');

it('Regex', () => {

    expect(Regex.prototype.errorNames()).toEqual({
        REGEX_FAILED_ERROR: Regex.prototype.REGEX_FAILED_ERROR
    });
});

it('Regex() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: Regex()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use Regex() as a function, create instance new Regex()");
    }
});

it('Regex - wrong arg', async () => {

    expect.assertions(1);

    try {

        await validator('test', new Regex('custom message'));
    }
    catch (e) {

        expect(e).toEqual("Regex: first argument must be regex or object");
    }
});

it('Regex - no regex given', async () => {

    expect.assertions(1);

    try {

        await validator('test', new Regex({
            message: 'custom message'
        }));
    }
    catch (e) {

        expect(e).toEqual("Regex: 'pattern' is not specified");
    }
});

it('Regex - custom message', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'startmidleend'
    }, new Collection({
        a: new Regex({
            message: 'custom message',
            pattern: /middle/
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "a",
                "custom message",
                "REGEX_FAILED_ERROR",
                "startmidleend"
            ]
        ]
    );
});

it('Regex - match: true, valid', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'startmiddleend'
    }, new Collection({
        a: new Regex(/middle/)
    }));

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});

it('Regex - match: true, invalid', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'startmidleend'
    }, new Collection({
        a: new Regex(/middle/)
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "a",
                "This value is not valid.",
                "REGEX_FAILED_ERROR",
                "startmidleend"
            ]
        ]
    );
});


it('Regex - match: false, valid', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'startmiddleend'
    }, new Collection({
        a: new Regex({
            pattern: /middle/,
            match: false,
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "a",
                "This value is not valid.",
                "REGEX_FAILED_ERROR",
                "startmiddleend"
            ]
        ]
    );
});

it('Regex - match: true, invalid', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'startmidleend'
    }, new Collection({
        a: new Regex({
            pattern: /middle/,
            match: false,
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});

it('Regex - stop [part 1]', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: 'onetothree',
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Regex(/two/),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "z",
                "This value is not valid.",
                "REGEX_FAILED_ERROR",
                "onetothree"
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


it('Regex - stop [part 2]', async () => {

    expect.assertions(1);

    let errors = await validator({
        z: 'onetothree',
        b: {
            a: {
                a: 'b',
                c: 'd',
                d: 'f'
            }
        }
    }, new Collection({
        z: new Regex(/two/, {async: -1, stop: true}),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "z",
                "This value is not valid.",
                "REGEX_FAILED_ERROR",
                "onetothree"
            ]
        ]
    );
});

it('Regex - not string value', async () => {

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
        z: new Regex(/two/),
        b: new Collection({
            a: new Count({min: 2, max: 2}),
        })
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "z",
                "This value is not valid.",
                "REGEX_FAILED_ERROR",
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
