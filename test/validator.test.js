
'use strict';

const validator     = require('../validator');

const Required      = require('../validator/constraints/Required');

const Length        = require('../validator/constraints/Length');

const IsNull        = require('../validator/constraints/IsNull');

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
                    "This value should have exactly 3 character.|This value should have exactly 3 characters.",
                    Length.prototype.TOO_LONG_ERROR,
                    "test"
                ]
            ]
        )
    );
});