'use strict';

const delay = require('../../validator/utils/delay');

const time = () => (new Date()).getTime();

it('delay()', async () => {

    expect.assertions(2);

    const start = time();

    const data = await delay(40, 'resolved');

    expect(time() - start).toBeGreaterThan(30);

    expect(data).toBe('resolved');
});

it('delay.reject()', async () => {

    expect.assertions(2);

    const start = time();

    try {

        await delay.reject(40, 'rejected');
    }
    catch (e) {

        expect(time() - start).toBeGreaterThan(30);

        expect(e).toBe('rejected');
    }
});

it('delay.then() - resolved', async () => {

    expect.assertions(2);

    const start = time();

    const data = await Promise.resolve('resolved').then(...delay.then(40));

    expect(time() - start).toBeGreaterThan(30);

    expect(data).toBe('resolved');
});

it('delay.then() - rejected', async () => {

    expect.assertions(2);

    const start = time();

    try {

        const data = await Promise.reject('rejected').then(...delay.then(40));
    }
    catch (e) {

        expect(time() - start).toBeGreaterThan(30);

        expect(e).toBe('rejected');
    }
});