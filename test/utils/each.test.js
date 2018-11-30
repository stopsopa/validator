'use strict';

try {require("karma_jest_shim")}catch(e){}

const each = require('../../validator/utils/each');

it('each() - array stop', done => {

    const a = 'qwertyuiop'.split('');

    const t = [];

    each(a, a => {
        t.push(a);
        if (a === 't') {
            return false;
        }
    });

    expect(t.join('')).toBe('qwert');

    done();
});

it('each() - object stop', done => {

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

    done();
});
