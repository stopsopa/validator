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

    errors = errors.getRaw();

    expect(errors).toEqual(
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

it('Type - check all types', async () => {

    const data = {
        'undefined' : undefined,
        'object'    : {},
        'boolean'   : true,
        'number'    : 67.6,
        'string'    : 'str',
        'function'  : function () {},
        'integer'   : 45,
        'array'     : []
    }

    const keys = Object.keys(data);

    expect.assertions(keys.length)

    return Promise.all(keys.map(async (type, i) => {

        let errors = await validator(data[type], new Type(type, {async: i}));

        errors = errors.getRaw();

        expect(errors).toEqual([]);
    }));
});

it('Type - not string', async () => {

    expect.assertions(1);

    try {

        let errors = await validator('one', new Type({
            type: false,
        }));
    }
    catch (e) {

        expect(e).toEqual("Type constraint: type parameter have to be string and one of: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", \"function\", \"integer\", \"array\"");
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

        expect(e).toEqual("Type constraint: type parameter is string but is not one of: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", \"function\", \"integer\", \"array\"");
    }
});