[![Build Status](https://travis-ci.org/stopsopa/validator.svg?branch=v0.0.83)](https://travis-ci.org/stopsopa/validator)
[![npm version](https://badge.fury.io/js/%40stopsopa%2Fvalidator.svg)](https://badge.fury.io/js/%40stopsopa%2Fvalidator)
[![Coverage Status](https://coveralls.io/repos/github/stopsopa/validator/badge.svg?branch=v0.0.83)](https://coveralls.io/github/stopsopa/validator?branch=v0.0.83)

# Loosely inspired by:
- https://symfony.com/doc/current/components/validator.html
- https://beanvalidation.org/1.0/spec/


I haven't found good enough implementation of JSR-303 Bean Validation for javascript, so here we go:

Main goals during implementation of this library was:

- simple and robust architecture
- asynchronous behaviour (due to asynchronous nature of javascript)
- extendability (custom asynchronous validator)
- validation of any data structure and easyness in use (guaranteed by following JSR-303)
- well tested (different node versions and browsers - done with "jest" and "karma") for polymorphic use on server and in the browser
- no dependencies 

Feel free to contribute. 

-----
-----

Simple example:
-

```javascript


import validator, {
    Collection,
    All,
    Required,
    Optional,
    NotBlank,
    Length,
    Email,
    Type,
    IsTrue,
} from '@stopsopa/validator';

(async () => {

    const errors = await validator({
        name            : '',
        surname         : 'doe',
        email           : '',
        terms           : false,
        comments        : [
            {
                comment: "What an ugly library"
            },
            {
                comment: 'empty'
            }
        ]
    }, new Collection({
        name            : new Required([
            new NotBlank(),
            new Length({min: 3, max: 255})
        ]),
        surname         : new Required([
            new NotBlank(),
            new Length({min: 10, max: 255})
        ]),
        email           : new Required(new Email()),
        terms           : new Optional(new IsTrue()),
        comments        : new All(new Collection({
            comment: new Required(new Length({min: 10}))
        }))
    }));

    console.log(JSON.stringify(errors.getFlat(), null, 4));
    // {
    //     "name": "This value should not be blank.",
    //     "surname": "This value is too short. It should have 10 characters or more.",
    //     "email": "This value is not a valid email address.",
    //     "terms": "This value should be true.",
    //     "comments.1.comment": "This value is too short. It should have 10 characters or more."
    // }

    console.log(JSON.stringify(errors.getTree(), null, 4));
    // {
    //     "name": "This value should not be blank.",
    //     "surname": "This value is too short. It should have 10 characters or more.",
    //     "email": "This value is not a valid email address.",
    //     "terms": "This value should be true.",
    //     "comments": {
    //         "1": {
    //             "comment": "This value is too short. It should have 10 characters or more."
    //         }
    //     }
    // }

})();


```

For further examples please follow [test cases](/stopsopa/validator/tree/master/test/constraints)

