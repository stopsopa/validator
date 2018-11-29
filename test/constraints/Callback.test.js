'use strict';

const validator     = require('../../validator');

const NotBlank      = require('../../validator/constraints/NotBlank');

const Callback      = require('../../validator/constraints/Callback');

const Length        = require('../../validator/constraints/Length');

const Collection    = require('../../validator/constraints/Collection');

const time = () => (new Date()).getTime();

it('Callback - main arg', async () => {

    expect.assertions(2);

    const start = time();

    let errors = await validator(
        'test',
        new Callback(
            (value, context, path, extra) =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {

                        if (value.length !== 5) {

                            context
                                .buildViolation('Custom message: {{ callback }}.')
                                .atPath(path)
                                .setParameter('{{ callback }}', 'not equal')
                                .setCode("CALLBACK_5")
                                .setInvalidValue(value)
                                .addViolation()
                            ;

                            if (extra.stop) {

                                return reject('reject Callback_5');
                            }
                        }

                        resolve('resolve Callback_5');
                    }, 50);
                })
        )
    );

    errors = errors.getRaw();

    expect(errors).toEqual(
        [
            [
                undefined,
                "Custom message: not equal.",
                "CALLBACK_5",
                "test"
            ]
        ]
    );

    expect(time() - start).toBeGreaterThan(30);
});


it('Callback - not function', async () => {

    expect.assertions(1);

    try {

        let errors = await validator('test', new Callback());
    }
    catch (e) {

        expect(e).toEqual("Callback constraint first arg should be function");
    }
});


it('Callback - not promise', async () => {

    expect.assertions(1);

    const errors = await validator('test', new Callback((value, context, path, extra) => {
        if (value.length !== 5) {

            context
                .buildViolation('Custom message: {{ callback }}.')
                .atPath(path)
                .setParameter('{{ callback }}', 'not equal')
                .setCode("CALLBACK_5")
                .setInvalidValue(value)
                .addViolation()
            ;
        }
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual(
        [
            [
                undefined,
                "Custom message: not equal.",
                "CALLBACK_5",
                "test"
            ]
        ]
    );
});
