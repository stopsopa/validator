'use strict';

const validator     = require('../../validator');

const IsNull = require('../../validator/constraints/IsNull');

it('IsNull', () => {

    var k = new IsNull();

    expect(
        JSON.stringify(
            k.errorNames()
        )
    ).toBe(
        JSON.stringify(
            {
                NOT_NULL_ERROR: IsNull.prototype.NOT_NULL_ERROR
            }
        )
    );
});

it('IsNull - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new IsNull('custom message'));

    errors = errors.getRaw();

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    null,
                    "custom message",
                    "NOT_NULL_ERROR",
                    "test"
                ]
            ]
        )
    );
});

it('IsNull - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('test', new IsNull('custom message'));

    errors = errors.getRaw();

    expect(
        JSON.stringify(
            errors
        )
    ).toBe(
        JSON.stringify(
            [
                [
                    null,
                    "custom message",
                    "NOT_NULL_ERROR",
                    "test"
                ]
            ]
        )
    );
});