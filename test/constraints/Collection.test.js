'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('collection allowExtraFields = false & allowMissingFields = false: both', async () => {

    expect.assertions(1);

    const errors = await validator({
        extra   : false, // checking existance not value
        one     : 'two',
        three    : 'four',
    }, new Collection({
        one     : new Optional(),
        three    : new Required(),
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
                        "one": "two",
                        "three": "four"
                    }
                ],
                [
                    "extra",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "extra": false,
                        "one": "two",
                        "three": "four"
                    }
                ]
            ]
        )
    );

});

it('collection allowExtraFields = false & allowMissingFields = false: missing', async () => {

    expect.assertions(1);

    const errors = await validator({
        // extra   : false, // checking existance not value
        // one     : 'two',
        // three    : 'four',
    }, new Collection({
        one     : new Required(),
        two     : new Required(),
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
                    "one",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {}
                ],
                [
                    "two",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {}
                ]
            ]
        )
    );

});

it('collection allowExtraFields = false & allowMissingFields = false: extra', async () => {

    expect.assertions(1);

    const errors = await validator({
        test    : null,
        two     : true,
        one     : false, // checking existance not value
    }, new Collection({
        test: new IsNull(),
        // one     : new Required(),
        // two     : new Required(),
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
                    "two",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "test": null,
                        "two": true,
                        "one": false
                    }
                ],
                [
                    "one",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "test": null,
                        "two": true,
                        "one": false
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

        expect(e + '').toBe('Collection doesn\'t accept array as an main option');
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

it('key - collection - used together with other constrain array', async () => {

    expect.assertions(2);

    const errors = await validator('test', new Required([
        new IsNull(),
        new Collection({
            test: new IsNull()
        })
    ]));

    expect(
        JSON.stringify(
            errors
        )
    ).toMatchSnapshot();

    expect(errors[0][0]).toBeUndefined();
});

it('key - collection - used together with other constrain require', async () => {

    expect.assertions(2);

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
    ).toMatchSnapshot();

    expect(errors[0][0]).toBeUndefined();
});

it('key - collection - used together with other constrain require x2', async () => {

    expect.assertions(2);

    let errors;

    errors = await validator('test', new Required(new Optional([
        new IsNull(),
        new Collection({
            test: new IsNull()
        })
    ])));

    expect(
        JSON.stringify(
            errors
        )
    ).toMatchSnapshot();

    expect(errors[0][0]).toBeUndefined();
});

it('collection-nested allowExtraFields = false & allowMissingFields = false: both', async () => {

    expect.assertions(1);

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
                    "b.c",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {
                        "second": "level"
                    }
                ],
                [
                    "b.second",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "second": "level"
                    }
                ],
                [
                    "d.f",
                    "This value should be null.",
                    "NOT_NULL_ERROR",
                    true
                ]
            ]
        )
    );

});

it('stack overflow', async () => {

    expect.assertions(1);

    const num = 1000;

    function buildData(left) {

        const data = {}

        if (left) {

            data.test = buildData(left - 1);
        }

        return data;
    }

    const data = buildData(num);

    // process.stdout.write(`\n\n\n`);
    //
    // console.log(JSON.stringify(data, null, 4));
    //
    // process.stdout.write(`\n\n\n`);

    const buildConstraints = left => new Collection({
        test: left ? buildConstraints(left - 1) : new IsNull()
    })

    const constraints = buildConstraints(num);

    // process.stdout.write(`\n\n\n`);
    //
    // console.log(JSON.stringify(constraints, null, 4));
    //
    // process.stdout.write(`\n\n\n`);

    const errors = await validator(data, constraints);

    expect(
        // JSON.stringify(
            errors
        // )
    ).toMatchSnapshot();
});

it('collection on array', async () => {

    expect.assertions(1);

    const errors = await validator({
        a: 'test',
        z: 'te',
        // b: [
        //     {
        //         c: 'd',
        //         e: 'f'
        //     },
        //     {
        //         g: 'h'
        //     }
        // ],
        b: {
            // '0': {
            //     c: 'd',
            //     e: 'f'
            // },
            '1': {
                g: 'h'
            }
        },
    }, new Collection({
        a: new Required(new Length(4)),
        z: new Length(2),
        b: new Collection({
            '0': new Collection({
                e: new Length(2),
            }),
            '1': new Collection({
                g: new Length(23),
                // e: new Length(2),
            })
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
                    "b.0",
                    "This field is missing.",
                    "MISSING_FIELD_ERROR",
                    {
                        "1": {
                            "g": "h"
                        }
                    }
                ],
                [
                    "b.1.g",
                    "This value should have exactly 23 character.|This value should have exactly 23 characters.",
                    "TOO_SHORT_ERROR",
                    "h"
                ]
            ]
        )
    );

});
it('collection on array 2', async () => {

    expect.assertions(1);

    const errors = await validator({
        a: 'test',
        z: 'te',
        b: [
            {
                c: 'd',
                e: 'f'
            },
            {
                g: 'h'
            }
        ],
        // b: {
        //     // '0': {
        //     //     c: 'd',
        //     //     e: 'f'
        //     // },
        //     '1': {
        //         g: 'h'
        //     }
        // },
    }, new Collection({
        a: new Required(new Length(4)),
        z: new Length(2),
        b: new Collection({
            '0': new Collection({
                e: new Length(1),
            }),
            '1': new Collection({
                g: new Length(2),
                // e: new Length(2),
            })
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
                    "b.0.c",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "c": "d",
                        "e": "f"
                    }
                ],
                [
                    "b.1.g",
                    "This value should have exactly 2 character.|This value should have exactly 2 characters.",
                    "TOO_SHORT_ERROR",
                    "h"
                ]
            ]
        )
    );

});

it('collection on array 3', async () => {

    expect.assertions(1);

    const errors = await validator([
        {
            c: 'd',
            e: 'f'
        },
        {
            g: 'h'
        }
    ], new Collection({
        '0': new Collection({
            e: new Length(1),
        }),
        '1': new Collection({
            g: new Length(2),
            // e: new Length(2),
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
                    "0.c",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "c": "d",
                        "e": "f"
                    }
                ],
                [
                    "1.g",
                    "This value should have exactly 2 character.|This value should have exactly 2 characters.",
                    "TOO_SHORT_ERROR",
                    "h"
                ]
            ]
        )
    );

});
