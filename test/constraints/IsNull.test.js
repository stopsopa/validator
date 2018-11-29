'use strict';

const validator     = require('../../validator');

const IsNull = require('../../validator/constraints/IsNull');

const Collection = require('../../validator/constraints/Collection');

it('IsNull', () => {

    var k = new IsNull();

    expect(k.errorNames()).toEqual({
        NOT_NULL_ERROR: IsNull.prototype.NOT_NULL_ERROR
    });
});

it('IsNull() - used as a function', async () => {

    expect.assertions(1);

    try {
        let errors = await validator('test', new Collection({
            test: IsNull()
        }));

        errors.getRaw();
    }
    catch (e) {

        expect(e + '').toBe("Don't use IsNull() as a function, create instance new IsNull()");
    }
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