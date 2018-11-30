'use strict';

try {require("karma_jest_shim")}catch(e){}

const arrayIntersect = require('../../validator/utils/arrayIntersect');

const ja = (a, b) => JSON.stringify(arrayIntersect(a, b));

it('arrayIntersect()', () => {

    expect(ja()).toBe(JSON.stringify([]));
});
it('arrayIntersect({})', () => {

    expect(ja({})).toBe(JSON.stringify([]));
});

it('arrayIntersect([]) - ! special case', () => {

    expect(ja([])).toBe(JSON.stringify([]));
});

it('arrayIntersect(new Date)', () => {

    expect(ja(new Date())).toBe(JSON.stringify([]));
});

it('arrayIntersect([a], [b])', () => {

    expect(ja(['a'], ['b'])).toBe(JSON.stringify([]));
});

it('arrayIntersect([a], [a])', () => {

    expect(ja(['a'], ['a'])).toBe(JSON.stringify(['a']));
});

it('arrayIntersect([a, b], [b])', () => {

    expect(ja(['a', 'b'], ['b'])).toBe(JSON.stringify(['b']));
});

it('arrayIntersect([a, b], [a])', () => {

    expect(ja(['a', 'b'], ['a'])).toBe(JSON.stringify(['a']));
});

it('arrayIntersect([a], [a, b])', () => {

    expect(ja(['a'], ['a', 'b'])).toBe(JSON.stringify(['a']));
});

it('arrayIntersect([a, b, c, d], [b, d])', () => {

    expect(ja(['a', 'b', 'c', 'd'], ['b', 'd'])).toBe(JSON.stringify(['b', 'd']));
});
