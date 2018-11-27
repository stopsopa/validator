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
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "test"
                ]
            ]
        )
    );
});

it('key - valid collection', async () => {

    const errors = await validator({
        test: 'abcdef'
    }, new Collection({
        test: new Length(6)
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

it('key - invalid collection, 1st level key', async () => {

    const errors = await validator({
        test: 'abcde'
    }, new Collection({
        test: new Length(6)
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 2st level key', async () => {

    const errors = await validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Collection({
            test2: new Length(6)
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
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 2st level key - behind Require 1', async () => {

    const errors = await validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Required(new Collection({
            test2: new Length(6)
        }))
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 2st level key - behind Require 2', async () => {

    const errors = await validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Required(new Collection({
            test2: new Required(new Length(6))
        }))
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 2st level key - behind Require 3', async () => {

    const errors = await validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Required([
            new Collection({
                test2: new Required(new Length(6))
            })
        ])
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 2st level key - behind Require 4', async () => {

    const errors = await validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Required([
            new Collection({
                test2: new Required([
                    new Length(6)
                ])
            })
        ])
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 3st level key - behind Require 5', async () => {

    const errors = await validator({
        test: {
            test2: {
                test3: 'abcde'
            }
        }
    }, new Collection({
        test: new Required([
            new Collection({
                test2: new Collection({
                    test3: new Required([
                        new Length(6)
                    ])
                })
            })
        ])
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test.test2.test3",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 3st level key - behind Require 4 - extra field', async () => {

    const errors = await validator({
        test: {
            extra: null,
            test2: {
                test3: 'abcde'
            }
        }
    }, new Collection({
        test: new Required([
            new Collection({
                test2: new Collection({
                    test3: new Required([
                        new Length(6)
                    ])
                })
            })
        ])
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test.extra",
                    "This field was not expected.",
                    "NO_SUCH_FIELD_ERROR",
                    {
                        "extra": null,
                        "test2": {
                            "test3": "abcde"
                        }
                    }
                ],
                [
                    "test.test2.test3",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});

it('key - invalid collection, 3st level key - behind Require 4 - extra field, allowExtraFields', async () => {

    const errors = await validator({
        test: {
            extra: null,
            test2: {
                test3: 'abcde'
            }
        }
    }, new Collection({
        test: new Required([
            new Collection({
                fields: {
                    test2: new Collection({
                        test3: new Required([
                            new Length(6)
                        ])
                    })
                },
                allowExtraFields: true,
            })
        ])
    }));

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    "test.test2.test3",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        )
    );
});