'use strict';

const validator     = require('../../validator');

const Type          = require('../../validator/constraints/Type');

const Length        = require('../../validator/constraints/Length');

const Collection    = require('../../validator/constraints/Collection');

it('Type', () => {

    var k = new Type('array');

    expect(k.errorNames()).toEqual({
        INVALID_TYPE_ERROR: Type.prototype.INVALID_TYPE_ERROR
    });
});

it('Type - custom message', async () => {

    expect.assertions(1);

    let errors = await validator([], new Type({
        message: 'Custom message: {{ type }}.',
        type: 'object'
    }));

    const row = errors.getRaw();

    expect(row).toEqual(
        [
            [
                undefined,
                "Custom message: object.",
                "INVALID_TYPE_ERROR",
                []
            ]
        ]
    );
});

it('Type - stop', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'a',
        b: {},
    }, new Collection({
        a: new Length(2, {async: 1}),
        b: new Type('array', {stop: true})
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "b",
                "This value should be of type 'array'.",
                "INVALID_TYPE_ERROR",
                {}
            ]
        ]
    );
});

it('Type - not string', async () => {

    expect.assertions(1);

    try {

        let errors = await validator('one', new Type({
            type: false,
        }));
    }
    catch (e) {

        expect(e).toEqual("Type constraint: Each of types have to be string one of: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", \"function\", \"integer\", \"array\"");
    }
});

it('Type - string', async () => {

    expect.assertions(1);

    try {

        let errors = await validator('one', new Type({
            type: 'other',
        }));
    }
    catch (e) {

        expect(e).toEqual("Type constraint: One of types is string but is not one of: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", \"function\", \"integer\", \"array\"");
    }
});

it('Type - array of types - ok', async () => {

    expect.assertions(1);

    let errors = await validator(56, new Type({
        type: ['string', 'integer'],
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual([]);
});

it('Type - array of types - wrong type', async () => {

    expect.assertions(1);

    try {

        let errors = await validator(true, new Type({
            type: ['string', 'iii'],
        }));
    }
    catch (e) {

        expect(e).toEqual("Type constraint: One of types is string but is not one of: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", \"function\", \"integer\", \"array\"");
    }
});

it('Type - array of types - wrong value type', async () => {

    expect.assertions(1);

    let errors = await validator(true, new Type({
        type: ['string', 'integer'],
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                undefined,
                "This value should be of type 'string, integer'.",
                "INVALID_TYPE_ERROR",
                true
            ]
        ]
    );
});

it('Type - check all types', async () => {

    const data = {
        'undefined'             : undefined,
        'object'                : {},
        'boolean'               : true,
        'number'                : 67.6,
        'string'                : 'str',
        'function'              : function () {},
        'integer'               : 45,
        'array'                 : [],
        'number boolean'        : 56,
        'number boolean '       : false,
        'string function'       : function () {},
        'string function '      : '',
        'string function  '     : 'a',
        'undefined integer'     : undefined,
        'undefined integer '    : 7,
    }

    const keys = Object.keys(data);

    expect.assertions(keys.length)

    return Promise.all(keys.map(async (type, i) => {

        let key = type;

        if (type.indexOf(' ') !== -1) {

            type = type.split(' ').filter(a => a);
        }

        let errors = await validator(data[key], new Type(type, {async: i}));

        errors = errors.getRaw();

        expect(errors).toEqual([]);
    }));
});


