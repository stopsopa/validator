
'use strict';

const validator     = require('../validator');

const Collection    = require('../validator/constraints/Collection');

const Required      = require('../validator/constraints/Required');

const Optional      = require('../validator/constraints/Optional');

const Length        = require('../validator/constraints/Length');

const IsNull        = require('../validator/constraints/IsNull');

const Context       = require('../validator/logic/Context');

it('validator', async () => {

    const errors = await validator('test', new IsNull());

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
});
it('context message not specified', async () => {

    expect.assertions(1);

    try {

        const context = new Context();

        context.buildViolation();
    }
    catch (e) {

        expect((e + '')).toBe("new Context(message).buildViolation(message): message not specified");
    }
});
it('validator', async () => {

    const errors = await validator('test', [
        new IsNull(),
        new Length(3),
    ]);

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
});
it('groups', async () => {

    const errors = await validator('test', [
        new IsNull({
            async: -20,
        }),
        new Length({
            min: 3,
            max: 3,
            async: 10,
        }),
    ]);

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
});

