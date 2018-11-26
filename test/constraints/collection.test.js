'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

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
        test    : null,
        dwa     : true,
        raz     : false, // checking existance not value
    }, new Collection({
        test: new IsNull(),
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
                        "test": null,
                        "dwa": true,
                        "raz": false
                    }
                ],
                [
                    "raz",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "test": null,
                        "dwa": true,
                        "raz": false
                    }
                ],
            ]
        )
    );

});

it('key - collection - no options', async () => {

    expect.assertions(1);

    try {

        const errors = await validator('test', new Collection());
    }
    catch (e) {

        expect(e + '').toBe('Describe at least one field in "fields" parameter');
    }
});

it('key - collection - array option', async () => {

    expect.assertions(1);

    try {

        const errors = await validator('test', new Collection([]));
    }
    catch (e) {

        expect(e + '').toBe('Describe at least one field in "fields" parameter');
    }
});

it('key - collection - empty object option', async () => {

    expect.assertions(1);

    try {

        const errors = await validator('test', new Collection({}));
    }
    catch (e) {

        expect(e + '').toBe('Describe at least one field in "fields" parameter');
    }
});

it('key - collection - IsNull() used as a function', async () => {

    expect.assertions(1);

    try {
        const errors = await validator('test', new Collection({
            test: IsNull()
        }));
    }
    catch (e) {

        expect(e + '').toBe("Don't use IsNull() as a function, create instance new IsNull()");
    }
});

it('key - collection - string but expect object with field', async () => {

    expect.assertions(1);

    const errors = await validator('test', new Collection({
        test: new IsNull()
    }));

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

it('key - collection - used together with other constrain', async () => {

    expect.assertions(1);

    try {
        const errors = await validator('test', new Required([
            new IsNull(),
            new Collection({
                test: new IsNull()
            })
        ]));
    }
    catch (e) {

        expect(e + '').toBe("connectAndSort(): Validator shouldn't be at this stage of type 'Existence'(Require or Optional), specify rather regular array of multiple validators");
    }
});

it('key - collection - used together with other constrain', async () => {

    expect.assertions(1);

    const errors = await validator('test', [
        new IsNull(),
        new Collection({
            test: new IsNull()
        })
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
                    "NOT_NULL_ERROR",
                    "test"
                ]
            ]
        )
    );
});
