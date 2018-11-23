'use strict';

const sub = require('./testlib/sub');

it('sub test', () => {
    expect(sub(50, 21)).toMatchSnapshot();
});
