'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const NotBlank      = require('../../validator/constraints/NotBlank');

const Context       = require('../../validator/logic/Context');

it('new ConstraintViolationList() ', async () => {

    expect.assertions(4);

    const errors = await validator({
        a: {
            a: {
                a: {
                    a: 'a',
                    z: 'a'
                },
                z: 'a'
            },
            z: 'a'
        },
        z: ''
    }, new Collection({
        a: new Collection({
            a: new Collection({
                a: new Collection({
                    a: new IsNull(),
                    z: new Length(3),
                }),
                z: new IsNull(),
            }),
            z: new Length(3),
        }),
        z: new NotBlank(),
    }));

    const result = [
        [
            "a.a.a.a",
            "This value should be null.",
            "NOT_NULL_ERROR",
            "a"
        ],
        [
            "a.a.z",
            "This value should be null.",
            "NOT_NULL_ERROR",
            "a"
        ]
    ];

    expect(errors.findByCodes(IsNull.prototype.NOT_NULL_ERROR)).toEqual(result);

    expect(errors.findByCodes([
        IsNull.prototype.NOT_NULL_ERROR,
        IsNull.prototype.NOT_NULL_ERROR
    ])).toEqual(result);

    expect(errors.findByCodes([
        IsNull.prototype.NOT_NULL_ERROR,
        NotBlank.prototype.IS_BLANK_ERROR,
    ])).toEqual(
        [
            [
                "a.a.a.a",
                "This value should be null.",
                "NOT_NULL_ERROR",
                "a"
            ],
            [
                "a.a.z",
                "This value should be null.",
                "NOT_NULL_ERROR",
                "a"
            ],
            [
                "z",
                "This value should not be blank.",
                "IS_BLANK_ERROR",
                ""
            ]
        ]
    );

    expect(errors.count()).toBe(5);
});

