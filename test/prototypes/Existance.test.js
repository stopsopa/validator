'use strict';

const Existence     = require('../../validator/prototypes/Existence');

it('Existance - just for coverage', () => {

    expect.assertions(1);

    var k = new Existence();

    expect(k instanceof Existence).toBe(true);
});
