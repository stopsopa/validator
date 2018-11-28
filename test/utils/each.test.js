'use strict';

const each = require('../../validator/utils/each');

it('each() - array stop', () => {

    const a = 'qwertyuiop'.split('');

    const t = [];

    each(a, a => {
        t.push(a);
        if (a === 't') {
            return false;
        }
    });

    expect(t.join('')).toBe('qwert');
});

it('each() - object stop', () => {

    const a = 'qwertyuiop'.split('');

    const b = a.reduce((acc, val) => {
        acc[val] = val;
        return acc;
    }, {});

    const t = [];

    each(b, a => {
        t.push(a);
        if (a === 'y') {
            return false;
        }
    })

    expect(t.join('')).toBe('qwerty');
});
