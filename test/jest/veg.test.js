'use strict';

// http://facebook.github.io/jest/docs/configuration.html#snapshotserializers-array-string
expect.addSnapshotSerializer({
   test: (val) => val.title && val.emoji,
   print: (val) => `${val.emoji} ${val.title}`
});

const veg = require('./testlib/veg');

it('veg test', () => {
    expect(veg).toMatchSnapshot();
});
