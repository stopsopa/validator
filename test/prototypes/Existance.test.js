'use strict';

try {require("karma_jest_shim")}catch(e){}

const Existence     = require('../../validator/prototypes/Existence');

it('Existance - just for coverage', done => {

    expect.assertions(1);

    var k = new Existence();

    expect(k instanceof Existence).toBe(true);

    done();
});
