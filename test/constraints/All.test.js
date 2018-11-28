'use strict';

const validator     = require('../../validator');

const All           = require('../../validator/constraints/All');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('All - empty', async () => {

    expect.assertions(1);

    let errors = await validator(null, new All());

    errors = errors.getRaw();

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            []
        )
    );
});

it('All', async () => {

    expect.assertions(1);

    let errors = await validator([
        {
            a: 'd',
            b: 'f',
            e: false,
            f: null,
        },
        {
            // a: 'h',
            // b: 'cb'
        }
    ], new All(new Collection({
        a: new Length(1),
        b: new Length(1),
        c: new IsNull(),
    })));

    errors = errors.getRaw();

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "0.c",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {
                        "a": "d",
                        "b": "f",
                        "e": false,
                        "f": null
                    }
                ],
                [
                    "0.e",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "a": "d",
                        "b": "f",
                        "e": false,
                        "f": null
                    }
                ],
                [
                    "0.f",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "a": "d",
                        "b": "f",
                        "e": false,
                        "f": null
                    }
                ],
                [
                    "1.a",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {}
                ],
                [
                    "1.b",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {}
                ],
                [
                    "1.c",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {}
                ]
            ]
        )
    );
});

it('All - nested', async () => {

    expect.assertions(1);

    let errors = await validator([
        [
            {
                a: 'b'
            }
        ],
        [
            {
                a: 'd'
            },
            {
                a: 'c2'
            }
        ]
    ], new All(new All(new Collection({
        a: new Length(1)
    }))));

    errors = errors.getRaw();

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "1.1.a",
                    "This value should have exactly 1 character.",
                    "TOO_LONG_ERROR",
                    "c2"
                ]
            ]
        )
    );
});