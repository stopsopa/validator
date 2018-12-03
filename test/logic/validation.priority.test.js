'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../../validator');

const Collection    = require('../../validator/constraints/Collection');

const Required      = require('../../validator/constraints/Required');

const Optional      = require('../../validator/constraints/Optional');

const Length        = require('../../validator/constraints/Length');

const IsNull        = require('../../validator/constraints/IsNull');

const Context       = require('../../validator/logic/Context');

it('pr', done => {

    return validator('test', new Required([
        new Length({
            min: 1,
            max: 2,
            maxMessage: 'len1'
        }),
        new Length({
            min: 2,
            max: 3,
            maxMessage: 'len2'
        }),
        new Length({
            min: 5,
            max: 6,
            minMessage: 'len3'
        })
    ])).then(errors => {

        let data = errors.getFlat(true);

        expect(data).toEqual(
            {"": ["len1", "len2", "len3"]}
        );

        data = errors.getFlat();

        expect(data).toEqual(
            {"": "len1"}
        );

        done();
    });
});

it('pr - 1', done => {

    return validator('test', new Required([
        new Length({
            min: 1,
            max: 2,
            maxMessage: 'len1'
        }),
        new Length({
            min: 2,
            max: 3,
            maxMessage: 'len2'
        }, 1),
        new Length({
            min: 5,
            max: 6,
            minMessage: 'len3'
        }, 1)
    ])).then(errors => {

        let data = errors.getFlat(true);

        expect(data).toEqual(
            {"": ["len2", "len3", "len1"]}
        );

        data = errors.getFlat();

        expect(data).toEqual(
            {"": "len2"}
        );

        done();
    });
});

it('pr - 2', done => {

    return validator('test', new Required([
        new Length({
            min: 1,
            max: 2,
            maxMessage: 'len1'
        }),
        new Length({
            min: 2,
            max: 3,
            maxMessage: 'len2'
        }, 1),
        new Length({
            min: 5,
            max: 6,
            minMessage: 'len3'
        }, 2)
    ])).then(errors => {

        let data = errors.getFlat(true);

        expect(data).toEqual(
            {"": ["len3", "len2", "len1"]}
        );

        data = errors.getFlat();

        expect(data).toEqual(
            {"": "len3"}
        );

        done();
    });
});

it('pr - 3', done => {

    return validator('test', new Required([
        new Length({
            min: 1,
            max: 2,
            maxMessage: 'len1'
        }),
        new Length({
            min: 2,
            max: 3,
            maxMessage: 'len2'
        }, 2),
        new Length({
            min: 5,
            max: 6,
            minMessage: 'len3'
        }, 1)
    ])).then(errors => {

        let data = errors.getFlat(true);

        expect(data).toEqual(
            {"": ["len2", "len3", "len1"]}
        );

        data = errors.getFlat();

        expect(data).toEqual(
            {"": "len2"}
        );

        done();
    });
});

it('pr collection- 3', done => {

    return validator({
        t: 'test',
    }, new Collection({
        t: new Required([
            new Length({
                min: 1,
                max: 2,
                maxMessage: 'len1'
            }),
            new Length({
                min: 2,
                max: 3,
                maxMessage: 'len2'
            }),
            new Length({
                min: 5,
                max: 6,
                minMessage: 'len3'
            })
        ])
    })).then(errors => {

        let data = errors.getFlat(true);

        expect(data).toEqual(
            {"t": ["len1", "len2", "len3"]}
        );

        data = errors.getFlat();

        expect(data).toEqual(
            {"t": "len1"}
        );

        done();
    });
});

it('pr collection- 3', done => {

    return validator({
        t: {
            a: 'test',
            b: 'cccc',
        },
        d: {
            e: 'aaaa',
            f: 'aaaa',
        }
    }, new Collection({
        t: new Collection({
            a: new Required([
                new Length({
                    min: 1,
                    max: 2,
                    maxMessage: 'len1'
                }, 1),
                new Length({
                    min: 2,
                    max: 3,
                    maxMessage: 'len2'
                }, 3),
                new Length({
                    min: 5,
                    max: 6,
                    minMessage: 'len3'
                }, 2)
            ]),
            b: new Required([
                new Length({
                    min: 1,
                    max: 2,
                    maxMessage: 'len1'
                }, 3),
                new Length({
                    min: 2,
                    max: 3,
                    maxMessage: 'len2'
                }, -1),
                new Length({
                    min: 5,
                    max: 6,
                    minMessage: 'len3'
                }, 2)
            ])
        }),
        d: new Collection({
            e: new Required([
                new Length({
                    min: 1,
                    max: 2,
                    maxMessage: 'len1'
                }, 3),
                new Length({
                    min: 2,
                    max: 3,
                    maxMessage: 'len2'
                }, 3),
                new Length({
                    min: 5,
                    max: 6,
                    minMessage: 'len3'
                }, 2)
            ]),
            f: new Required([
                new Length({
                    min: 1,
                    max: 2,
                    maxMessage: 'len1'
                }, -2),
                new Length({
                    min: 2,
                    max: 3,
                    maxMessage: 'len2'
                }, -3),
                new Length({
                    min: 5,
                    max: 6,
                    minMessage: 'len3'
                }, -1)
            ])
        })
    })).then(errors => {

        let data = errors.getFlat(true);

        expect(data).toEqual(
            {
                "d.e": [
                    "len1",
                    "len2",
                    "len3"
                ],
                "d.f": [
                    "len3",
                    "len1",
                    "len2"
                ],
                "t.a": [
                    "len2",
                    "len3",
                    "len1"
                ],
                "t.b": [
                    "len1",
                    "len3",
                    "len2"
                ]
            }
        );

        data = errors.getFlat();

        expect(data).toEqual(
            {
                "d.e": "len1",
                "d.f": "len3",
                "t.a": "len2",
                "t.b": "len1"
            }
        );

        data = errors.getTree(true);

        expect(data).toEqual(
            {
                "d": {
                    "e": [
                        "len1",
                        "len2",
                        "len3"
                    ],
                    "f": [
                        "len3",
                        "len1",
                        "len2"
                    ]
                },
                "t": {
                    "a": [
                        "len2",
                        "len3",
                        "len1"
                    ],
                    "b": [
                        "len1",
                        "len3",
                        "len2"
                    ]
                }
            }
        );

        data = errors.getTree();

        expect(data).toEqual(
            {
                "d": {
                    "e": "len1",
                    "f": "len3"
                },
                "t": {
                    "a": "len2",
                    "b": "len1"
                }
            }
        );

        done();
    });
});









