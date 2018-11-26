'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('Collection', () => {

    var k = new Collection();

    expect(
        JSON.stringify(
            k.errorNames()
        )
    ).toBe(
        JSON.stringify(
            {
                // MISSING_FIELD_ERROR: Collection.prototype.MISSING_FIELD_ERROR,
                // NO_SUCH_FIELD_ERROR: Collection.prototype.NO_SUCH_FIELD_ERROR,
                MISSING_FIELD_ERROR: 'MISSING_FIELD_ERROR',
                NO_SUCH_FIELD_ERROR: 'NO_SUCH_FIELD_ERROR',
            }
        )
    );



    // expect(k.validate()).toBe('test');
});


it('collection allowExtraFields = false & allowMissingFields = false: both', async () => {

    const errors = await validator({
        extra   : false, // checking existance not value
        raz     : 'dwa',
        trzy    : 'cztery',
    }, new Collection({
        raz     : new Optional(),
        trzy    : new Required(),
        n       : new IsNull(),
    }), {
        // debug: true,
    });


    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "n",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {
                        "extra": false,
                        "raz": "dwa",
                        "trzy": "cztery"
                    }
                ],
                [
                    "extra",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "extra": false,
                        "raz": "dwa",
                        "trzy": "cztery"
                    }
                ]
            ]
        )
    );

});

it('collection allowExtraFields = false & allowMissingFields = false: missing', async () => {

    const errors = await validator({
        // extra   : false, // checking existance not value
        // raz     : 'dwa',
        // trzy    : 'cztery',
    }, new Collection({
        raz     : new Required(),
        dwa     : new Required(),
    }), {
        // debug: true,
    });


    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "raz",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {}
                ],
                [
                    "dwa",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {}
                ]
            ]
        )
    );

});

it('collection allowExtraFields = false & allowMissingFields = false: extra', async () => {

    const errors = await validator({
        dwa     : true,
        raz     : false, // checking existance not value
    }, new Collection({
        // raz     : new Required(),
        // dwa     : new Required(),
    }), {
        // debug: true,
    });


    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "dwa",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "dwa": true,
                        "raz": false
                    }
                ],
                [
                    "raz",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "dwa": true,
                        "raz": false
                    }
                ],
            ]
        )
    );

});