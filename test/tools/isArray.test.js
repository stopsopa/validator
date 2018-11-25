'use strict';

const isArray = require('../../validator/utils/isArray');

it('isArray()', () => {

    expect(isArray()).toBe(false);
});
it('isArray({})', () => {

    expect(isArray({})).toBe(false);
});

it('isArray([]) - ! special case', () => {

    expect(isArray([])).toBe(true);
});

it('isArray(new Date)', () => {

    expect(isArray(new Date())).toBe(false);
});
