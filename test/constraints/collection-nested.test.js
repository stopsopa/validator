'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('collection-nested allowExtraFields = false & allowMissingFields = false: both', async () => {


    // var a = new Collection({
    //     a: 'b'
    // })
    //
    // console.log(`\n\n\nsee a: \n\n\n\n`, a);
    //
    // var b = new Collection({
    //     c: 'd'
    // })
    //
    // console.log(`\n\n\nsee b: \n\n\n\n`, b);
    //
    //
    //
    // return;


    const errors = await validator({
        a       : false, // checking existance not value
        b       : {
            second: 'level',
        },
        d       : {
            e : null,
            f : true,
        }
    }, new Collection({
        a   : new Required(),
        b   : new Collection({
            c : new Required()
        }),
        d   : new Collection({
            e : new IsNull(),
            f : new IsNull(),
        })
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "c",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {
                        "second": "level"
                    }
                ],
                [
                    "second",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "second": "level"
                    }
                ],
                [
                    null,
                    "This value should be null.",
                    "NOT_NULL_ERROR",
                    true
                ]
            ]
        )
    );

});
