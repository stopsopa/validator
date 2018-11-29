'use strict';

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it("validation stop", async () => {

    expect.assertions(2);

    const errors = await validator({
        a: {
            b: 'b',
        },
        z: 'z'
    }, new Collection({
        a: new Collection({
            b: new Length(3, {async: -1, stop: true}),
            // async: -1 - means it will be check first (because number is smaller, it could be also -100)

            // stop: true - means if Lenght constrain will detect error then
            // stop validators with bigger async value

            // async groups in the way:
            //      - group all validator with the same async value
            //      - run in sequence group by group from smaller to bigger async

            // stop means:
            //      If one of validators will detect error
            //      then don't check any validator with higher async
        }),
        z: new Length(3), // async no defined - so default is 0
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
            }
        }
    );
});



it("validation stop 3 levels - normal", async () => {

    expect.assertions(2);

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
        z: 'z'
    }, new Collection({
        a: new Collection({
            a: new Collection({
                a: new Collection({
                    a: new Length(3),
                    z: new Length(3),
                }),
                z: new Length(3),
            }),
            z: new Length(3),
        }),
        z: new Length(3),
    }));

    const raw = errors.getRaw();

    expect(
        raw
    ).toEqual(
        [
            [
                "a.a.a.a",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
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
                "a": {
                    "a": {
                        "a": [
                            "This value should have exactly 3 characters."
                        ],
                        "z": [
                            "This value should have exactly 3 characters."
                        ]
                    },
                    "z": [
                        "This value should have exactly 3 characters."
                    ]
                },
                "z": [
                    "This value should have exactly 3 characters."
                ]
            },
            "z": [
                "This value should have exactly 3 characters."
            ]
        }
    );
});


it("validation stop 3 levels - async", async () => {

    expect.assertions(2);

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
        z: 'z'
    }, new Collection({
        a: new Collection({
            a: new Collection({
                a: new Collection({
                    a: new Length(3, {async: 1}),
                    z: new Length(3, {async: 2}),
                }),
                z: new Length(3, {async: 3}),
            }),
            z: new Length(3, {async: 5}),
        }),
        z: new Length(3, {async: 4}),
    }));

    const raw = errors.getRaw();

    expect(
        raw
    ).toEqual(
        [
            [
                "a.a.a.a",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "z"
            ],
            [
                "a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ]
        ]
    );

    const tree = errors.getTree();

    expect(
        tree
    ).toEqual(
        {
            "a": {
                "a": {
                    "a": {
                        "a": [
                            "This value should have exactly 3 characters."
                        ],
                        "z": [
                            "This value should have exactly 3 characters."
                        ]
                    },
                    "z": [
                        "This value should have exactly 3 characters."
                    ]
                },
                "z": [
                    "This value should have exactly 3 characters."
                ]
            },
            "z": [
                "This value should have exactly 3 characters."
            ]
        }
    );
});


it("validation stop 3 levels - stop", async () => {

    expect.assertions(2);

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
        z: 'z'
    }, new Collection({
        a: new Collection({
            a: new Collection({
                a: new Collection({
                    a: new Length(3, {async: 1}),
                    z: new Length(3, {async: 2}),
                }),
                z: new Length(3, {async: 3, stop: true}),
            }),
            z: new Length(3, {async: 5}),
        }),
        z: new Length(3, {async: 4}),
    }));

    const raw = errors.getRaw();

    expect(
        raw
    ).toEqual(
        [
            [
                "a.a.a.a",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ]
        ]
    );

    const tree = errors.getTree();

    expect(
        tree
    ).toEqual(
        {
            "a": {
                "a": {
                    "a": {
                        "a": [
                            "This value should have exactly 3 characters."
                        ],
                        "z": [
                            "This value should have exactly 3 characters."
                        ]
                    },
                    "z": [
                        "This value should have exactly 3 characters."
                    ]
                }
            }
        }
    );
});


it("validation stop 3 levels - reverse", async () => {

    expect.assertions(2);

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
        z: 'z'
    }, new Collection({
        a: new Collection({
            a: new Collection({
                a: new Collection({
                    a: new Length(3, {async: 5}),
                    z: new Length(3, {async: 4}),
                }),
                z: new Length(3, {async: 3}),
            }),
            z: new Length(3, {async: 1}),
        }),
        z: new Length(3, {async: 2}),
    }));

    const raw = errors.getRaw();

    expect(
        raw
    ).toEqual(
        [
            [
                "a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "z"
            ],
            [
                "a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "a.a.a.a",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ]
        ]
    );

    const tree = errors.getTree();

    expect(
        tree
    ).toEqual(
        {
            "a": {
                "a": {
                    "a": {
                        "a": [
                            "This value should have exactly 3 characters."
                        ],
                        "z": [
                            "This value should have exactly 3 characters."
                        ]
                    },
                    "z": [
                        "This value should have exactly 3 characters."
                    ]
                },
                "z": [
                    "This value should have exactly 3 characters."
                ]
            },
            "z": [
                "This value should have exactly 3 characters."
            ]
        }
    );
});




it("validation stop 3 levels - reverse stop", async () => {

    expect.assertions(2);

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
        z: 'z'
    }, new Collection({
        a: new Collection({
            a: new Collection({
                a: new Collection({
                    a: new Length(3, {async: 5}),
                    z: new Length(3, {async: 4}),
                }),
                z: new Length(3, {async: 3, stop: true}),
            }),
            z: new Length(3, {async: 1}),
        }),
        z: new Length(3, {async: 2}),
    }));

    const raw = errors.getRaw();

    expect(
        raw
    ).toEqual(
        [
            [
                "a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ],
            [
                "z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "z"
            ],
            [
                "a.a.z",
                "This value should have exactly 3 characters.",
                "TOO_SHORT_ERROR",
                "a"
            ]
        ]
    );

    const tree = errors.getTree();

    expect(
        tree
    ).toEqual(
        {
            "a": {
                "a": {
                    "z": [
                        "This value should have exactly 3 characters."
                    ]
                },
                "z": [
                    "This value should have exactly 3 characters."
                ]
            },
            "z": [
                "This value should have exactly 3 characters."
            ]
        }
    );
});

