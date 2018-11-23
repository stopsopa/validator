'use strict';

// https://facebook.github.io/jest/docs/en/asynchronous.html#callbacks
(function () {

    // callback

    function fetchData(callback) {
        setTimeout(callback, 100, {
            one: 'two'
        });
    }

    test('the data is peanut butter', done => {

        function callback(data) {
            expect(data).toEqual({"one": "two"});
            done();
        }

        fetchData(callback);
    });

}());

// https://facebook.github.io/jest/docs/en/asynchronous.html#promises
(function () {
    function fetchData (rejected) {
        return new Promise(function (resolve, reject) {
            setTimeout(rejected ? reject : resolve, 100, {
                one: 'two'
            });
        });
    }

    test('promise resolved', () => {

        // expect.assertions(1); // not necessary because unresolving or rejecting promise will cause test to fail anyway
        // but good to know ...

        // be sure to return, can cause always passing test silently
        return fetchData().then((data) => {
            expect(data).toEqual({"one": "two"});
        });
    });

    test('promise rejected', () => {

        expect.assertions(1); // now it's more usefull

        return fetchData(true).catch((data) => {
            expect(data).toEqual({"one": "two"});
        });
    });

    // https://facebook.github.io/jest/docs/en/asynchronous.html#resolves-rejects

    test('promise .resolves', () => {

        expect.assertions(1);

        return expect(fetchData()).resolves.toEqual({"one": "two"});
    });


    test('promise .rejects', () => {

        expect.assertions(1);

        return expect(fetchData(true)).rejects.toEqual({"one": "two"});
    });
}());

// https://facebook.github.io/jest/docs/en/asynchronous.html#async-await
(function () {

    function fetchData (rejected) {
        return new Promise(function (resolve, reject) {
            setTimeout(rejected ? reject : resolve, 100, {
                one: 'two'
            });
        });
    }

    test('async - resolved', async () => {

        expect.assertions(1);

        const data = await fetchData();

        expect(data).toEqual({"one": "two"});
    });

    test('async - rejected', async () => {

        expect.assertions(1);

        try {
            await fetchData(true);
        } catch (e) {
            expect(e).toEqual({"one": "two"});
        }
    });

    test('async - .resolves', async () => {
        expect.assertions(1);
        await expect(fetchData()).resolves.toEqual({"one": "two"});
    });

    test('async - .rejects', async () => {
        expect.assertions(1);
        await expect(fetchData(true)).rejects.toEqual({"one": "two"});
    });

}());
