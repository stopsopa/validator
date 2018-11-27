'use strict';

const Context     = require('../../validator/logic/Context');

it('new Context().buildViolation() ', async () => {

    expect.assertions(1);

    try {

        (new Context()).buildViolation();
    }
    catch (e) {

        expect(e + '').toBe("new Context(message).buildViolation(message): message not specified");
    }
});

it('new Context().buildViolation(false) ', async () => {

    expect.assertions(1);

    try {

        (new Context()).buildViolation(false);
    }
    catch (e) {

        expect(e + '').toBe("new Context(message).buildViolation(message): message arg must be string");
    }
});
