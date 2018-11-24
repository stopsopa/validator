'use strict';

const sub = require('../validator/sub');

it('subsubsubsubsubsubsubsub', () => {

    expect(sub(50, 20)).toMatchSnapshot();
});
