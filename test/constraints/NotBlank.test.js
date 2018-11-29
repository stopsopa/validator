'use strict';

const validator     = require('../../validator');

const NotBlank      = require('../../validator/constraints/NotBlank');

const Length        = require('../../validator/constraints/Length');

const Collection    = require('../../validator/constraints/Collection');

it('NotBlank', () => {

    var k = new NotBlank();

    expect(k.errorNames()).toEqual({
        IS_BLANK_ERROR: NotBlank.prototype.IS_BLANK_ERROR,
    });
});

it('NotBlank - custom message', async () => {

    expect.assertions(1);

    let errors = await validator('', new NotBlank('custom message'));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "custom message",
                "IS_BLANK_ERROR",
                ""
            ]
        ]
    );
});

it('NotBlank - stop', async () => {

    expect.assertions(1);

    let errors = await validator({
        a: 'a',
        b: '',
    }, new Collection({
        a: new Length(2, {async: 1}),
        b: new NotBlank(undefined, {stop: true})
    }));

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                "b",
                "This value should not be blank.",
                "IS_BLANK_ERROR",
                ""
            ]
        ]
    );
});