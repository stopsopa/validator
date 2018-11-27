'use strict';

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
                // NOT_NULL_ERROR: IsNull.prototype.NOT_NULL_ERROR,
                NOT_NULL_ERROR: 'NOT_NULL_ERROR'
            }
        )
    );
});