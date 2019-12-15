'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../../validator');

const NotBlank      = require('../../validator/constraints/NotBlank');

const Callback      = require('../../validator/constraints/Callback');

const Required      = require('../../validator/constraints/Required');

const Length        = require('../../validator/constraints/Length');

const Collection    = require('../../validator/constraints/Collection');

const time = () => (new Date()).getTime();

it('Callback - main arg', done => {

    const start = time();

    return validator(
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

                            if (extra && extra.stop) {

                                return reject('reject Callback_5');
                            }
                        }

                        resolve('resolve Callback_5');
                    }, 50)
                })
        )
    ).then(errors => {
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

        done();
    });
});


it('Callback - not function', done => {
    try {

        validator('test', new Callback());
    }
    catch (e) {

        expect(e).toEqual("Callback constraint first arg should be function");

        done();
    }
});


it('Callback - not promise', done => {

    return validator('test', new Callback((value, context, path, extra) => {
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
    })).then(errors => {

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

        done();
    });
});

// it('Callback - race 1', done => {
//
//     return validator('tes', new Required([
//         new Callback(
//             (value, context, path, extra) =>
//                 new Promise((resolve, reject) => {
//                     setTimeout(() => {
//
//                         if (value.length !== 5) {
//
//                             context
//                                 .buildViolation('Custom message 1: {{ callback }}.')
//                                 .atPath(path)
//                                 .setParameter('{{ callback }}', 'not equal 1')
//                                 .setCode("CALLBACK_15")
//                                 .setInvalidValue(value)
//                                 .addViolation()
//                             ;
//
//                             if (extra && extra.stop) {
//
//                                 return reject('reject Callback_5');
//                             }
//                         }
//
//                         resolve('resolve Callback_5');
//                     }, 50)
//                 })
//         ),
//         new Callback(
//             (value, context, path, extra) =>
//                 new Promise((resolve, reject) => {
//                     setTimeout(() => {
//
//                         if (value.length !== 4) {
//
//                             context
//                                 .buildViolation('Custom message 2: {{ callback }}.')
//                                 .atPath(path)
//                                 .setParameter('{{ callback }}', 'not equal 2')
//                                 .setCode("CALLBACK_25")
//                                 .setInvalidValue(value)
//                                 .addViolation()
//                             ;
//
//                             if (extra && extra.stop) {
//
//                                 return reject('reject Callback_5');
//                             }
//                         }
//
//                         resolve('resolve Callback_5');
//                     }, 150)
//                 })
//         )
//     ])).then(errors => {
//
//         const raw = errors.getRaw();
//
//         expect(raw).toEqual(
//             [
//                 [
//                     undefined,
//                     "Custom message 1: not equal 1.",
//                     "CALLBACK_15",
//                     "tes"
//                 ],
//                 [
//                     undefined,
//                     "Custom message 2: not equal 2.",
//                     "CALLBACK_25",
//                     "tes"
//                 ]
//             ]
//         );
//
//         done();
//     });
// });
//
// it('Callback - race 2', done => {
//
//     return validator('tes', new Required([
//         new Callback(
//             (value, context, path, extra) =>
//                 new Promise((resolve, reject) => {
//                     setTimeout(() => {
//
//                         if (value.length !== 5) {
//
//                             context
//                                 .buildViolation('Custom message 1: {{ callback }}.')
//                                 .atPath(path)
//                                 .setParameter('{{ callback }}', 'not equal 1')
//                                 .setCode("CALLBACK_15")
//                                 .setInvalidValue(value)
//                                 .addViolation()
//                             ;
//
//                             if (extra && extra.stop) {
//
//                                 return reject('reject Callback_5');
//                             }
//                         }
//
//                         resolve('resolve Callback_5');
//                     }, 150)
//                 })
//         ),
//         new Callback(
//             (value, context, path, extra) =>
//                 new Promise((resolve, reject) => {
//                     setTimeout(() => {
//
//                         if (value.length !== 4) {
//
//                             context
//                                 .buildViolation('Custom message 2: {{ callback }}.')
//                                 .atPath(path)
//                                 .setParameter('{{ callback }}', 'not equal 2')
//                                 .setCode("CALLBACK_25")
//                                 .setInvalidValue(value)
//                                 .addViolation()
//                             ;
//
//                             if (extra && extra.stop) {
//
//                                 return reject('reject Callback_5');
//                             }
//                         }
//
//                         resolve('resolve Callback_5');
//                     }, 50)
//                 })
//         )
//     ])).then(errors => {
//
//         const raw = errors.getRaw();
//
//         expect(raw).toEqual(
//             [
//                 [
//                     undefined,
//                     "Custom message 1: not equal 1.",
//                     "CALLBACK_15",
//                     "tes"
//                 ],
//                 [
//                     undefined,
//                     "Custom message 2: not equal 2.",
//                     "CALLBACK_25",
//                     "tes"
//                 ]
//             ]
//         );
//
//         done();
//     });
// });
