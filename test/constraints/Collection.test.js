'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('Collection allowExtraFields = false & allowMissingFields = false: both', async () => {

    expect.assertions(2);

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

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "n",
                "This field is missing.",
                "UNKNOWN_FIELD_ERROR",
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
    );

    const flat = errors.getFlat();

    expect(flat).toEqual(
        {"extra": ["This field was not expected."], "n": ["This field is missing."]}
    );

});

it('Collection allowExtraFields = false & allowMissingFields = false: missing', async () => {

    expect.assertions(2);

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

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "one",
                "This field is missing.",
                "UNKNOWN_FIELD_ERROR",
                {}
            ],
            [
                "two",
                "This field is missing.",
                "UNKNOWN_FIELD_ERROR",
                {}
            ]
        ]
    );

    const flat = errors.getFlat();

    expect(flat).toEqual(
        {"one": ["This field is missing."], "two": ["This field is missing."]}
    );

});

it('Collection allowExtraFields = false & allowMissingFields = false: extra', async () => {

    expect.assertions(1);

    let errors = await validator({
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

    errors = errors.getRaw();

    expect(errors).toEqual(
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
    );
});

it('key - Collection - no options', async () => {

    expect.assertions(1);

    try {

        let errors = await validator('test', new Collection());

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Collection accept only plain object as a first argument");
    }
});

it('key - Collection - array option', async () => {

    expect.assertions(1);

    try {

        let errors = await validator('test', new Collection([]));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Collection accept only plain object as a first argument");
    }
});

it('key - Collection - empty object option', async () => {

    expect.assertions(1);

    try {

        let errors = await validator('test', new Collection({}));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe('Describe at least one field in "fields" parameter');
    }
});

it('key - Collection - string but expect object with field', async () => {

    expect.assertions(1);

    let errors = await validator('test', new Collection({
        test: new IsNull()
    }));

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});

it('key - Collection - used together with other constrain array', async () => {

    expect.assertions(2);

    let errors = await validator('test', [
        new IsNull(),
        new Collection({
            test: new IsNull()
        })
    ]);

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "This value should be null.",
                "NOT_NULL_ERROR",
                "test"
            ]
        ]
    )

    expect(errors[0][0]).toBeUndefined();
});

it('key - Collection - used together with other constraint require', async () => {

    expect.assertions(2);

    let errors = await validator('test', new Required([
        new IsNull(),
        new Collection({
            test: new IsNull()
        })
    ]));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "This value should be null.",
                "NOT_NULL_ERROR",
                "test"
            ]
        ]
    )

    expect(errors[0][0]).toEqual()
});

it('key - Collection - used together with other constrain require x2', async () => {

    expect.assertions(2);

    let errors;

    errors = await validator('test', new Required(new Optional([
        new IsNull(),
        new Collection({
            test: new IsNull()
        })
    ])));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [[undefined, "This value should be null.", "NOT_NULL_ERROR", "test"]]
    );

    expect(errors[0][0]).toBeUndefined();
});

it('Collection-nested allowExtraFields = false & allowMissingFields = false: both', async () => {

    expect.assertions(3);

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

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                "b.c",
                "This field is missing.",
                "UNKNOWN_FIELD_ERROR",
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
    );

    const flat = errors.getFlat();

    expect(flat).toEqual(
        {
            "b.c": [
                "This field is missing."
            ],
            "b.second": [
                "This field was not expected."
            ],
            "d.f": [
                "This value should be null."
            ]
        }
    );

    const tree = errors.getTree();

    expect(tree).toEqual(
        {
            "b": {
                "c": [
                    "This field is missing."
                ],
                "second": [
                    "This field was not expected."
                ]
            },
            "d": {
                "f": [
                    "This value should be null."
                ]
            }
        }
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

    let errors = await validator(data, constraints);

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test.test",
                "This field is missing.",
                "UNKNOWN_FIELD_ERROR",
                {}
            ]
        ]
    )
});

it('Collection on array', async () => {

    expect.assertions(1);

    let errors = await validator({
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

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "b.0",
                "This field is missing.",
                "UNKNOWN_FIELD_ERROR",
                {
                    "1": {
                        "g": "h"
                    }
                }
            ],
            [
                "b.1.g",
                "This value should have exactly 23 characters.",
                "TOO_SHORT_ERROR",
                "h"
            ]
        ]
    );

});
it('Collection on array 2', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'test',
        z: 'te',
        b: [
            {
                c: 'd',
                e: 'f'
            },
            {
                g: 'h'
            },
            {
                g: 'h1'
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
            }),
            '2': new Collection({
                g: new Length(1),
                // e: new Length(2),
            })
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
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
                "This value should have exactly 2 characters.",
                "TOO_SHORT_ERROR",
                "h"
            ],
            [
                "b.2.g",
                "This value should have exactly 1 character.",
                "TOO_LONG_ERROR",
                "h1"
            ]
        ]
    );

});

it('Collection on array 3', async () => {

    expect.assertions(1);

    let errors = await validator([
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

    errors = errors.getRaw();

    expect(errors).toEqual(
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
                "This value should have exactly 2 characters.",
                "TOO_SHORT_ERROR",
                "h"
            ]
        ]
    );

});

it("Collection - allowMissingFields: false", async () => {

    expect.assertions(1);

    let errors = await validator({
        a: null,
    }, new Collection({
        a: new IsNull(),
        b: new Length(3),
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [["b", "This field is missing.", "UNKNOWN_FIELD_ERROR", {"a": null}]]
    );
});

it("Collection - allowMissingFields: true", async () => {

    expect.assertions(1);

    let errors = await validator({
        a: null,
    }, new Collection({
        fields: {
            a: new IsNull(),
            b: new Length(3),
        },
        allowMissingFields: true
    }));

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});


it("Collection deep - allowMissingFields: false", async () => {

    expect.assertions(1);

    let errors = await validator({
        a: {
            b: {
                c: 'abc',
            }
        },
    }, new Collection({
        a: new Collection({
            b: new Collection({
                c: new Length(3),
                d: new Length(2),
            })
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "a.b.d",
                "This field is missing.",
                "UNKNOWN_FIELD_ERROR",
                {
                    "c": "abc"
                }
            ]
        ]
    );
});

it("Collection deep - allowMissingFields: true", async () => {

    expect.assertions(1);

    let errors = await validator({
        a: {
            b: {
                c: 'abc',
            }
        },
    }, new Collection({
        a: new Collection({
            b: new Collection({
                fields: {
                    c: new Length(3),
                    d: new Length(2),
                },
                allowMissingFields: true,
            })
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});

it("Collection deep, no data", async () => {

    expect.assertions(1);

    let errors = await validator({
        a: {
            b: null,
        },
    }, new Collection({
        a: new Collection({
            b: new Collection({
                fields: {
                    c: new Length(3),
                    d: new Length(2),
                },
                // allowMissingFields: true,
            })
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});

it('Collection - array as a root', async () => {

    expect.assertions(1);

    let errors = await validator('abc', [
        new Required(new Length(4)),
    ]);

    errors = errors.getRaw();

    expect(errors).toEqual([[undefined, "This value should have exactly 4 characters.", "TOO_SHORT_ERROR", "abc"]]);
});

it('Collection - no constraints true', async () => {

    expect.assertions(1);

    let errors = await validator('abc', true);

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});

it('Collection - no constraints false', async () => {

    expect.assertions(1);

    let errors = await validator('abc', false);

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});

it('Collection - no constraints undefined', async () => {

    expect.assertions(1);

    let errors = await validator('abc');

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});


it("Collection no data", async () => {

    expect.assertions(1);

    let errors = await validator(undefined , new Collection({
        a: new Collection({
            b: new Collection({
                fields: {
                    c: new Length(3),
                    d: new Length(2),
                },
                // allowMissingFields: true,
            })
        })
    }));

    errors = errors.getRaw();

    expect(errors).toEqual([]);
});
