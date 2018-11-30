'use strict';

try {require("karma_polyfill")}catch(e){}

const Existence     = require('../../validator/prototypes/Existence');

it('Existance - just for coverage', done => {

    var k = new Existence();

    expect(k instanceof Existence).toBe(true);

    done();
});
