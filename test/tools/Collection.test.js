'use strict';

const Collection = require('../../validator/constraints/Collection');

it('Collection', () => {

    var k = new Collection();

    expect(
        JSON.stringify(
            k.errorNames()
        )
    ).toBe(
        JSON.stringify(
            {
                // MISSING_FIELD_ERROR: Collection.prototype.MISSING_FIELD_ERROR,
                // NO_SUCH_FIELD_ERROR: Collection.prototype.NO_SUCH_FIELD_ERROR,
                MISSING_FIELD_ERROR: 'MISSING_FIELD_ERROR',
                NO_SUCH_FIELD_ERROR: 'NO_SUCH_FIELD_ERROR',
            }
        )
    );



    // expect(k.validate()).toBe('test');
});