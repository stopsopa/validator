'use strict';

// more about expect vvv
// more about expect vvv
// more about expect vvv
//      https://facebook.github.io/jest/docs/expect.html
// more about expect ^^^
// more about expect ^^^
// more about expect ^^^

it('just jest', () => {

    expect(2 + 2).toBe(4);

    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2}); // use === (recursive)

    for (let a = 1; a < 10; a++) {
        for (let b = 1; b < 10; b++) {
            expect(a + b).not.toBe(0);
        }
    }

    // https://facebook.github.io/jest/docs/en/using-matchers.html#truthiness
    expect(null).toBeNull();
    expect().toBeUndefined();
    expect(5).toBeDefined();
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
});

test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
});

test('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
});

// https://facebook.github.io/jest/docs/en/using-matchers.html#numbers
test('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);

    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    // toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
});

test('adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    expect(value).not.toBe(0.3);    // It isn't! Because rounding error
    expect(value).toBeCloseTo(0.3); // This works.
});

// https://facebook.github.io/jest/docs/en/using-matchers.html#strings
test('there is no I in team', () => {
    expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
});


// https://facebook.github.io/jest/docs/en/using-matchers.html#arrays
(function () {
    const shoppingList = [
        'diapers',
        'kleenex',
        'trash bags',
        'paper towels',
        'beer',
    ];

    test('the shopping list has beer on it', () => {
        expect(shoppingList).toContain('beer');
    });
}());

// https://facebook.github.io/jest/docs/en/using-matchers.html#exceptions

(function () {
    function compileAndroidCode() {
        throw new Error('you are using the wrong JDK');
    }

    test('compiling android goes as expected', () => {
        expect(compileAndroidCode).toThrow();
        expect(compileAndroidCode).toThrow(Error);

        // You can also use the exact error message or a regexp
        expect(compileAndroidCode).toThrow('you are using the wrong JDK');
        expect(compileAndroidCode).toThrow(/JDK/);
    });
}());