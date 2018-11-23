'use strict';

// https://facebook.github.io/jest/docs/en/setup-teardown.html#content
// just go to doc, nothing to check manually...

test.only('only', () => {
    expect(true).toBeTruthy();
});

test('skipped', () => {
    expect('A').toBe('A');
});