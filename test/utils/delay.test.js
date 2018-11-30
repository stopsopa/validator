'use strict';

try {require("karma_polyfill")}catch(e){}

const delay = require('../../validator/utils/delay');

const time = () => (new Date()).getTime();

it('delay()', done => {

    const start = time();

    return delay(40, 'resolved').then(data => {

        expect(time() - start).toBeGreaterThan(30);

        expect(data).toBe('resolved');

        done();
    });
});

it('delay.reject()', done => {

    const start = time();

    return delay.reject(40, 'rejected').catch(e => {

        expect(time() - start).toBeGreaterThan(30);

        expect(e).toBe('rejected');

        done();
    });
});

it('delay.then() - resolved', done => {

    const start = time();

    return Promise.resolve('resolved').then(...delay.then(40)).then(data => {

        expect(time() - start).toBeGreaterThan(30);

        expect(data).toBe('resolved');

        done();
    });
});

it('delay.then() - rejected', done => {

    const start = time();

    return Promise.reject('rejected').then(...delay.then(40)).catch(e => {

        expect(time() - start).toBeGreaterThan(30);

        expect(e).toBe('rejected');

        done();
    });
});