'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

jest.setTimeout(30000);

it("Collection async", async () => {

    expect.assertions(2);

    const errors = await validator({
        a: {
            b: 'b',
        },
        z: 'z'
    }, new Collection({
        a: new Collection({
            b: new Length(3, {async: -1}),
        }),
        z: new Length(3),
    }));

    const raw = errors.getRaw();

    expect(
        raw
    ).toEqual(
        [
            [
                "a.b",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "b"
            ],
            [
                "z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "z"
            ]
        ]
    );

    const tree = errors.getTree();

    expect(
        tree
    ).toEqual(
        {
            "a": {
                "b": [
                    "This value should have exactly 3 characters."
                ]
            },
            "z": [
                "This value should have exactly 3 characters."
            ]
        }
    );
});

it("Collection async - reversed", async () => {

    expect.assertions(2);

    const errors = await validator({
        a: {
            b: 'b',
        },
        z: 'z'
    }, new Collection({
        a: new Collection({
            b: new Length(3, {async: 1}),
        }),
        z: new Length(3),
    }));

    const raw = errors.getRaw();

    expect(
        raw
    ).toEqual(
        [
            [
                "z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "z"
            ],
            [
                "a.b",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "b"
            ]
        ]
    );

    const tree = errors.getTree();

    expect(
        tree
    ).toEqual(
        {
            "a": {
                "b": [
                    "This value should have exactly 3 characters."
                ]
            },
            "z": [
                "This value should have exactly 3 characters."
            ]
        }
    );
});