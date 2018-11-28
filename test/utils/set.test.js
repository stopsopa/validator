'use strict';

const set = require('../../validator/utils/set');

it('set() - key null', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, null, 'test');

    expect(target).toBe('test');
});

it('set() - key undefined', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, undefined, 'test');

    expect(target).toBe('test');
});

it('set() - key false', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, false, 'test');

    expect(target).toBe('test');
});

it('set() - key true', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, false, 'test');

    expect(target).toBe('test');
});

it('set() - key int 0', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 0, 'test');

    expect(target).toEqual({0:'test'});
});

it('set() - key int 1', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 1, 'test');

    expect(target).toEqual({1:'test'});
});

it('set() - key object empty', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, {}, 'test');

    expect(target).toBe('test');
});

it('set() - key object a b', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, {a:'b', c:'d'}, 'test');

    expect(target).toEqual({"b":{"d":'test'}});
});

it('set() - key object a b c', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, {a:'b', c:'d', e: 'ff'}, 'test');

    expect(target).toEqual({"b":{"d":{ff:'test'}}});
});

it('set() - key object a b c - not empty source', () => {

    expect.assertions(1);

    let target = {
        g: { h: 'i' }
    };

    target = set(target, {a:'b', c:'d', e: 'ff'}, 'test');

    expect(
        target
    ).toEqual(
        {"b": {"d": {"ff": "test"}}, "g": {"h": "i"}}
    );
});

it('set() - key array a b c - not empty source', () => {

    expect.assertions(1);

    let target = {
        g: { h: 'i' }
    };

    target = set(target, ['b', 'd', 'ff'], 'test');

    expect(
        target
    ).toEqual(
        {"b": {"d": {"ff": "test"}}, "g": {"h": "i"}}
    );
});

it('set() - key array false - not empty source', () => {

    expect.assertions(1);

    let target = [];

    target = set(target, false, 'test');

    expect(
        target
    ).toEqual(
        "test"
    );
});

it('set() - not empty array - key 0', () => {

    expect.assertions(1);

    let target = [
        'one'
    ];

    target = set(target, 0, 'test');

    expect(
        target
    ).toEqual(
        ["test"]
    );
});

it('set() - not empty array - key 1', () => {

    expect.assertions(1);

    let target = [
        'one'
    ];

    target = set(target, 1, 'test');

    expect(
        target
    ).toEqual(
        ['one', "test"]
    );
});

it('set() - not empty array - key 4', () => {

    expect.assertions(1);

    let target = [
        'one'
    ];

    target = set(target, 4, 'test');

    expect(
        target
    ).toEqual(
        ['one', undefined, undefined, undefined, "test"]
    );
});

it('set() - not empty array - key l4 [expected error]', () => {

    expect.assertions(1);

    let target = [
        'one'
    ];

    try {

        target = set(target, 'l4', 'test');
    }
    catch (e) {

        expect(
            e
        ).toEqual(
            "if source is array and key is not integer nor empty string then its not possible to add to array, given key: \"l4\""
        );
    }
});

it('set() - false - key 4', () => {

    expect.assertions(1);

    let target = false;

    target = set(target, 4, 'test');

    expect(
        target
    ).toEqual(
        {"4": 'test'}
    );
});

it('set() - [] - key ""', () => {

    expect.assertions(1);

    let target = [];

    target = set(target, '', 'test');

    expect(
        target
    ).toEqual(
        ['test']
    );
});

it('set() - {} - key a.', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 'a.', 'test');

    expect(
        target
    ).toEqual(
        {"a": ['test']}
    );
});

it('set() - {} - key a. x2', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 'a.', 'test');

    target = set(target, 'a.', 'end');

    expect(
        target
    ).toEqual(
        {"a": ['test', 'end']}
    );
});

it('set() - {} - key a.b.', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 'a.b.', 'test');

    target = set(target, 'a.b.', 'end');

    expect(
        target
    ).toEqual(
        {"a": {"b" : ['test', 'end']}}
    );
});

it('set() - {} - key a.b.', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 'a.b.', 'test');

    target = set(target, 'a.b.1', 'end');

    expect(
        target
    ).toEqual(
        {"a": {"b" : ['test', 'end']}}
    );
});

it('set() - {} - key a.b.', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 'a.b.c.', 'test');

    target = set(target, 'a.b.d.', 'end');

    expect(
        target
    ).toEqual(
        {"a": {"b": {"c": ["test"], "d": ["end"]}}}
    );
});

it('set() - complex', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 'one.', 'two');
    target = set(target, 'one.', 'two2');

    target = set(target, 'three.', 'four');
    target = set(target, 'three.', 'four2');

    target = set(target, 'six.seven.', 'eight');
    target = set(target, 'six.seven.', 'eight2');

    target = set(target, 'nine.ten.eleven.', 'twelve');
    target = set(target, 'nine.ten.eleven.', 'twelve2');

    // console.log(JSON.stringify(target, null, 4));

    expect(
        target
    ).toEqual(
        {
            "one": [
                "two",
                "two2"
            ],
            "three": [
                "four",
                "four2"
            ],
            "six": {
                "seven": [
                    "eight",
                    "eight2"
                ]
            },
            "nine": {
                "ten": {
                    "eleven": [
                        "twelve",
                        "twelve2"
                    ]
                }
            }
        }
    );
});

it('set() - complex reverse', () => {

    expect.assertions(1);

    let target = {};

    target = set(target, 'nine.ten.eleven.', 'twelve');
    target = set(target, 'nine.ten.eleven.', 'twelve2');

    target = set(target, 'six.seven.', 'eight');
    target = set(target, 'six.seven.', 'eight2');

    target = set(target, 'three.', 'four');
    target = set(target, 'three.', 'four2');

    target = set(target, 'one.', 'two');
    target = set(target, 'one.', 'two2');

    // console.log(JSON.stringify(target, null, 4));

    expect(
        target
    ).toEqual(
        {
            "nine": {
                "ten": {
                    "eleven": [
                        "twelve",
                        "twelve2"
                    ]
                }
            },
            "six": {
                "seven": [
                    "eight",
                    "eight2"
                ]
            },
            "three": [
                "four",
                "four2"
            ],
            "one": [
                "two",
                "two2"
            ]
        }
    );
});
