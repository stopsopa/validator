'use strict';

const mul = require('./testlib/mul');

it('mul test', () => {
    expect(mul(8, 4)).toMatchSnapshot();
});
