'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('key - flat', async () => {

    const errors = await validator('test', new Length(6));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    null,
                    "This value should have exactly 6 character.|This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "test"
                ]
            ]
        )
    );
});