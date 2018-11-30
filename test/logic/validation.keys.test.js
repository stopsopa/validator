'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('key - flat', done => {

    return validator('test', new Length(6)).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual([
            [
                undefined,
                "This value should have exactly 6 characters.",
                "TOO_SHORT_ERROR",
                "test"
            ]
        ]);

        done();
    });
});

it('key - valid collection', done => {

    return validator({
        test: 'abcdef'
    }, new Collection({
        test: new Length(6)
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual([]);

        done();
    });
});

it('key - invalid collection, 1st level key', done => {

    return validator({
        test: 'abcde'
    }, new Collection({
        test: new Length(6)
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});

it('key - invalid collection, 2st level key', done => {

    return validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Collection({
            test2: new Length(6)
        })
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});

it('key - invalid collection, 2st level key - behind Require 1', done => {

    return validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Required(new Collection({
            test2: new Length(6)
        }))
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});

it('key - invalid collection, 2st level key - behind Require 2', done => {

    return validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Required(new Collection({
            test2: new Required(new Length(6))
        }))
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});

it('key - invalid collection, 2st level key - behind Require 3', done => {

    return validator({
        test: {
            test2: 'abcde'
        }
    }, new Collection({
        test: new Required([
            new Collection({
                test2: new Required(new Length(6))
            })
        ])
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});

it('key - invalid collection, 2st level key - behind Require 4', done => {

    return validator({
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
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test.test2",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});

it('key - invalid collection, 3st level key - behind Require 5', done => {

    return validator({
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
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test.test2.test3",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});

it('key - invalid collection, 3st level key - behind Require 4 - extra field', done => {

    return validator({
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
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
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
        );

        done();
    });
});

it('key - invalid collection, 3st level key - behind Require 4 - extra field, allowExtraFields', done => {

    return validator({
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
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "test.test2.test3",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    });
});