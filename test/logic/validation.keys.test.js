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

     validator('test', new Length(6)).then(errors => {

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
    }, e => done({e}));
});

it('key - valid collection', done => {

     validator({
        test: 'abcdef'
    }, new Collection({
        test: new Length(6)
    })).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual([]);

        done();
    }, e => done({e}));
});

it('key - invalid collection, 1st level key', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 2st level key', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 2st level key - behind Require 1', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 2st level key - behind Require 2', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 2st level key - behind Require 3', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 2st level key - behind Require 4', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 3st level key - behind Require 5', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 3st level key - behind Require 4 - extra field', done => {

     validator({
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
    }, e => done({e}));
});

it('key - invalid collection, 3st level key - behind Require 4 - extra field, allowExtraFields', done => {

     validator({
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
    }, e => done({e}));
});

it('key - add prefix', done => {

     validator({
        a: 'te',
        test: {
            extra: null,
            test2: {
                test3: 'abcde'
            }
        }
    }, new Collection({
        a: new Length(80),
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
    }), {
        path: 'pre.fix'
    }).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "pre.fix.a",
                    "This value should have exactly 80 characters.",
                    "TOO_SHORT_ERROR",
                    "te"
                ],
                [
                    "pre.fix.test.test2.test3",
                    "This value should have exactly 6 characters.",
                    "TOO_SHORT_ERROR",
                    "abcde"
                ]
            ]
        );

        done();
    }, e => done({e}));
});

it('key - add prefix (empty string)', done => {

     validator({
        a: 'te',
        test: {
            extra: null,
            test2: {
                test3: 'abcde'
            }
        }
    }, new Collection({
        a: new Length(80),
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
    }), {
        path: ''
    }).then(errors => {

        errors = errors.getRaw();

        expect(errors).toEqual(
            [
                [
                    "a",
                    "This value should have exactly 80 characters.",
                    "TOO_SHORT_ERROR",
                    "te"
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
    }, e => done({e}));
});