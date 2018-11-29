'use strict';

const validator     = require('../../validator');

const IsNull = require('../../validator/constraints/IsNull');

it('IsNull', () => {

    var k = new IsNull();

    expect(k.errorNames()).toEqual({
        NOT_NULL_ERROR: IsNull.prototype.NOT_NULL_ERROR
    });
});

it('IsNull - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new IsNull('custom message'));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "custom message",
                "NOT_NULL_ERROR",
                "test"
            ]
        ]
    );
});

it('IsNull - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new IsNull('custom message'));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "custom message",
                "NOT_NULL_ERROR",
                "test"
            ]
        ]
    );
});