'use strict';

const validator     = require('../../validator');

const Context       = require('../../validator/logic/Context');

const Callback      = require('../../validator/constraints/Callback');

const All           = require('../../validator/constraints/All');

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

it('new Constraint().getExtra() ', async () => {

    expect.assertions(1);

    let errors = await validator(
        ['test'],
        new All(
            new Callback(
                (value, context, path, extra) =>
                    new Promise((resolve, reject) => {

                        if (value.length !== 5) {

                            context
                                .buildViolation(JSON.stringify(extra))
                                .atPath(path)
                                // .setParameter('{{ callback }}', 'not equal')
                                .setCode("CALLBACK_5")
                                .setInvalidValue(value)
                                .addViolation()
                            ;

                            if (extra.stop) {

                                return reject('reject Callback_5');
                            }
                        }

                        resolve('resolve Callback_5');
                    }),
                {
                    extra: 'callback'
                }
            )
        ),
        {
            extra: 'context'
        }
    );

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                0,
                "{\"extra\":\"callback\"}",
                "CALLBACK_5",
                "test"
            ]
        ]
    );
});

it('new Context().getExtra() ', async () => {

    expect.assertions(1);

    let errors = await validator(
        ['test'],
        new All(
            new Callback(
                (value, context, path, extra) =>
                    new Promise((resolve, reject) => {

                        if (value.length !== 5) {

                            context
                                .buildViolation(JSON.stringify(context.getExtra()))
                                .atPath(path)
                                // .setParameter('{{ callback }}', 'not equal')
                                .setCode("CALLBACK_5")
                                .setInvalidValue(value)
                                .addViolation()
                            ;

                            if (extra.stop) {

                                return reject('reject Callback_5');
                            }
                        }

                        resolve('resolve Callback_5');
                    }),
                {
                    extra: 'callback'
                }
            )
        ),
        {
            extra: 'context'
        }
    );

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                0,
                "{\"extra\":\"context\"}",
                "CALLBACK_5",
                "test"
            ]
        ]
    );
});



it('new Context().getRoot() ', async () => {

    expect.assertions(1);

    let errors = await validator(
        ['test'],
        new All(
            new Callback(
                (value, context, path, extra) =>
                    new Promise((resolve, reject) => {

                        if (value.length !== 5) {

                            context
                                .buildViolation(JSON.stringify(context.getRoot()))
                                .atPath(path)
                                .setCode("CALLBACK_5")
                                .setInvalidValue(value)
                                .addViolation()
                            ;

                            if (extra.stop) {

                                return reject('reject Callback_5');
                            }
                        }

                        resolve('resolve Callback_5');
                    }),
                {
                    extra: 'callback'
                }
            )
        ),
        {
            extra: 'context'
        }
    );

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                0,
                "[\"test\"]",
                "CALLBACK_5",
                "test"
            ]
        ]
    );
});

