'use strict';

const add = require('./testlib/add');

it('add test', () => {
    expect(add(2, 3)).toMatchSnapshot();
});
