
import "@babel/polyfill";

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
} from './validator';

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


