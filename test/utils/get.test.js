'use strict';

try {require("karma_polyfill")}catch(e){}

const get = require('../../validator/utils/get');

const data = {
    test: {
        one: [
            {
                two: 'three',
            }
        ],
        empty: false
    }
}

it('simple', () => {

    expect(get(data, 'test.one.0.two')).toBe('three');
});

it('json false', () => {

    expect(
        JSON.stringify(get(data))
    ).toBe(
        JSON.stringify(data)
    );
});

it('json []', () => {

    expect(
        JSON.stringify(get([]))
    ).toBe(
        JSON.stringify([])
    );
});

it('json undefined 1', () => {

    expect(
        JSON.stringify(get(undefined, "one.two", 'test'))
    ).toBe(
        JSON.stringify('test')
    );
});

it('json undefined 2', () => {

    expect(
        JSON.stringify(get(undefined, "two", 'test'))
    ).toBe(
        JSON.stringify('test')
    );
});

it('json {}', () => {

    expect(
        JSON.stringify(get({}, "two", 'test'))
    ).toBe(
        JSON.stringify('test')
    );
});

it('json [] key', () => {

    expect(
        JSON.stringify(get([], 'key'))
    ).toBe(
        JSON.stringify(undefined)
    );
});

it("json [] ''", () => {

    expect(
        JSON.stringify(get([], ''))
    ).toBe(
        JSON.stringify([])
    );
});

it("json [] 'key' 'default'", () => {
    expect(get([], 'returndefualt', 'default')).toBe('default');
});

it("json 'string' 'key' 'default'", () => {
    expect(get('string', 'returndefualt', 'default')).toBe('default');
});

it("json 'string' 'key' 'default'", () => {
    expect(get('string', '3', 'default')).toBe('i');
});

it('json empty', () => {
    expect(
        get(data, 'test.empty')
    ).toBe(false);
});
