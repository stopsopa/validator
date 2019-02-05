[![Build Status](https://travis-ci.org/stopsopa/validator.svg?branch=v0.0.97)](https://travis-ci.org/stopsopa/validator)
[![npm version](https://badge.fury.io/js/%40stopsopa%2Fvalidator.svg)](https://badge.fury.io/js/%40stopsopa%2Fvalidator)
[![codecov](https://codecov.io/gh/stopsopa/validator/branch/v0.0.97/graph/badge.svg)](https://codecov.io/gh/stopsopa/validator/tree/v0.0.97/validator)
[![NpmLicense](https://img.shields.io/npm/l/@stopsopa/validator.svg)](https://github.com/stopsopa/validator/blob/master/LICENSE)

## Table of Contents

<!-- toc -->

- [Loosely inspired by:](#loosely-inspired-by)
- [live example:](#live-example)
- [Simple example:](#simple-example)
- [example](#example)
  * [entity manager](#entity-manager)
  * [controller](#controller)
- [addidional tools](#addidional-tools)
- [validators references](#validators-references)
  * [Blank](#blank)
  * [Callback](#callback)
  * [Choice](#choice)
  * [Collection](#collection)
  * [Count](#count)
  * [Email](#email)
  * [IsFalse](#isfalse)
  * [IsTrue](#istrue)
  * [IsNull](#isnull)
  * [Length](#length)
  * [NotBlank](#notblank)
  * [NotNull](#notnull)
  * [Regex](#regex)
  * [Type](#type)

<!-- tocstop -->

_(TOC generated using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

# Loosely inspired by:
- https://symfony.com/doc/current/components/validator.html
- https://beanvalidation.org/1.0/spec/

# live example:
    
[https://codesandbox.io/s/ymwky9603j](https://codesandbox.io/s/ymwky9603j)
    

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

# Simple example:

```javascript


import validator, {
    Required,
    Optional,
    Collection,
    All,
    Blank,
    Callback,
    Choice,
    Count,
    Email,
    IsFalse,
    IsNull,
    IsTrue,
    Length,
    NotBlank,
    NotNull,
    Regex,
    Type,
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

# example

## entity manager

```javascript

const abstract          = require('@stopsopa/knex-abstract');

const extend            = abstract.extend;

const prototype         = abstract.prototype;

const log               = require('inspc');

const a                 = prototype.a;

const {
    Collection,
    All,
    Required,
    Optional,
    NotBlank,
    Length,
    Email,
    Type,
    IsTrue,
    Callback,
    Regex,
} = require('@stopsopa/validator');

const ext = {
    initial: async function () {
        return {
            updated     : this.now(),
            created     : this.now(),
            port        : 80,
        }
    },
    toDb: row => {

        return row;
    },
    update: function (...args) {

        let [debug, trx, entity, id] = a(args);

        delete entity.created;

        entity.updated = this.now();

        return prototype.prototype.update.call(this, debug, trx, entity, id);
    },
    insert: async function (...args) {

        let [debug, trx, entity] = a(args);

        entity.created = this.now();

        delete entity.updated;
        
        const id = await prototype.prototype.insert.call(this, debug, trx, entity);

        return id;
    },
    prepareToValidate: function (data = {}, mode) {

        delete data.created;

        delete data.updated;

        return data;
    },
    getValidators: function (mode = null, id, entity) {

        const validators = {
            id: new Optional(),
            cluster: new Required([
                new NotBlank(),
                new Length({max: 50}),
                new Callback(
                    (value, context, path, extra) =>
                        new Promise(async (resolve, reject) => {

                            const {
                                cluster,
                                node,
                                id,
                            } = context.rootData;

                            const condition = (node === null) ? 'is' : '=';

                            let c;

                            log(mode);

                            if (mode === 'create') {

                                c = await this.queryColumn(true, `select count(*) c from :table: where cluster = :cluster and node ${condition} :node`, {
                                    cluster,
                                    node,
                                });
                            }
                            else {

                                c = await this.queryColumn(true, `select count(*) c from :table: where cluster = :cluster and node ${condition} :node and id != :id`, {
                                    cluster,
                                    node,
                                    id,
                                });
                            }


                            log.dump(c);

                            const code = "CALLBACK-NOTUNIQUE";

                            if (c > 0) {

                                context
                                    .buildViolation('Not unique')
                                    .atPath(path)
                                    .setParameter('{{ callback }}', 'not equal')
                                    .setCode(code)
                                    .setInvalidValue(`cluster: '${cluster}' and node: '${node}'`)
                                    .addViolation()
                                ;

                                if (extra && extra.stop) {

                                    return reject('reject ' + code);
                                }
                            }

                            resolve('resolve ' + code);
                        })
                )
            ]),
            domain: new Required([
                new NotBlank(),
                new Length({max: 50}),
            ]),
            port: new Required([
                new NotBlank(),
                new Length({max: 8}),
                new Regex(/^\d+$/),
            ]),
        };

        if (typeof entity.node !== 'undefined') {

            if (entity.node === null) {

                validators.node = new Optional();
            }
            else {

                validators.node = new Required([
                    new NotBlank(),
                    new Length({max: 50}),
                ]);
            }
        }

        return new Collection(validators);
    },
};    

module.exports = knex => extend(
    knex,
    prototype,
    Object.assign({}, require('./abstract'), ext),
    'clusters',
    'id',
);
```

## controller
```javascript

const knex          = require('@stopsopa/knex-abstract');

const log           = require('inspc');

const validator     = require('@stopsopa/validator');
    ...
    app.all('/register', async (req, res) => {

        let entity              = req.body;

        let id                  = entity.id;

        const mode              = id ? 'edit' : 'create';

        const man               = knex().model.clusters;

        const validators        = man.getValidators(mode, id);

        if (mode === 'create') {

            entity = {
                ...man.initial(),
                ...entity,
            };
        }

        const entityPrepared    = man.prepareToValidate(entity, mode);
        
        const errors            = await validator(entityPrepared, validators);

        if ( ! errors.count() ) {

            try {

                if (mode === 'edit') {

                    await man.update(entityPrepared, id);
                }
                else {

                    id = await man.insert(entityPrepared);
                }

                entity = await man.find(id);

                if ( ! entity ) {

                    return res.jsonError("Database state conflict: updated/created entity doesn't exist");
                }
            }
            catch (e) {

                log.dump(e);

                return res.jsonError(`Can't register: ` + JSON.stringify(req.body));
            }
        }

        return res.jsonNoCache({
            entity: entity,
            errors: errors.getTree(),
        });

    });
    ...
```

For further examples please follow [test cases](https://github.com/stopsopa/validator/tree/master/test/constraints)


# addidional tools
    

    require('@stopsopa/validator/set')
    require('@stopsopa/validator/get')
    require('@stopsopa/validator/delay')
    require('@stopsopa/validator/each')
    require('@stopsopa/validator/size')

# validators references

## Blank

Source code [Blank.js](validator/constraints/Blank.js)

```javascript
new Blank({
    message    : 'This value should be blank.',    
});
```          

## Callback

Source code [Callback.js](validator/constraints/Callback.js)

See test example [Callback.test.js](test/constraints/Callback.test.js)

```javascript
new Callback((value, context, path, extra) => {...}); // function required
```   
 
## Choice

Source code [Choice.js](validator/constraints/Choice.js)

```javascript
new Choice({
    choices         : [], // required

    multiple        : false, 
    min             : 0, // only if multiple=true
    max             : 0, // only if multiple=true
    
    message         : 'The value you selected is not a valid choice.',
    multipleMessage : 'One or more of the given values is invalid.',
    minMessage      : 'You must select at least {{ limit }} choice.|You must select at least {{ limit }} choices.',
    maxMessage      : 'You must select at most {{ limit }} choice.|You must select at most {{ limit }} choices.',
});
```  

## Collection

Source code [Collection.js](validator/constraints/Collection.js)

```javascript
new Collection({
    fields                  : { // required type: non empty object
        a: new Require(),
        b: new Optional(),
    }, 
    allowExtraFields        : false,
    allowMissingFields      : false,
    extraFieldsMessage      : 'This field was not expected.',
    missingFieldsMessage    : 'This field is missing.',   
});

// or shorter syntax if only fields are given:

new Collection({ // required type: non empty object
    a: new Require(),
    b: new Optional(),
});
```  

## Count

Source code [Count.js](validator/constraints/Count.js)

```javascript
new Count({
    // min; // min or max required (or both) - if min given then have to be > 0
    // max, // min or max required (or both) - if max given then have to be > 0
    
    minMessage: 'This collection should contain {{ limit }} element or more.|This collection should contain {{ limit }} elements or more.',
    maxMessage: 'This collection should contain {{ limit }} element or less.|This collection should contain {{ limit }} elements or less.',
    exactMessage: 'This collection should contain exactly {{ limit }} element.|This collection should contain exactly {{ limit }} elements.',
});

// or shorter syntax if ony min and max given and min = max:

new Count(5);
``` 

## Email

Source code [Email.js](validator/constraints/Email.js)

```javascript
new Email({
    message    : 'This value is not a valid email address.',  
});
```      

## IsFalse

Source code [IsFalse.js](validator/constraints/IsFalse.js)

```javascript
new IsFalse({
    message    : 'This value should be false.',
});
```         

## IsTrue

Source code [IsTrue.js](validator/constraints/IsTrue.js)

```javascript
new IsTrue({
    message    : 'This value should be true.',
});
```                                             

## IsNull

Source code [IsNull.js](validator/constraints/IsNull.js)

```javascript
new IsNull({
    message    : 'This value should be null.',
});
```                                      
                                           
## Length

Source code [Length.js](validator/constraints/Length.js)

```javascript
new Length({
    // min; // min or max required (or both) 
    // max, // min or max required (or both) 
    
    maxMessage: 'This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.',
    minMessage: 'This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.',
    exactMessage: 'This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.',
});
```                                       
                                           
## NotBlank

Source code [NotBlank.js](validator/constraints/NotBlank.js)

```javascript
new NotBlank({
    message    : 'This value should not be blank.',
});
```                                        
                                           
## NotNull

Source code [NotNull.js](validator/constraints/NotNull.js)

```javascript
new NotNull({
    message    : 'This value should not be blank.',
});
```                                          
                                           
## Regex

Source code [Regex.js](validator/constraints/Regex.js)

```javascript
new Regex({
    pattern     : /abc/gi, // required, type regex
    message     : 'This value is not valid.',
    match       : true,
});
```                                           
                                           
## Type

Source code [Type.js](validator/constraints/Type.js)

```javascript
// available values for field 'type' are:
// 'undefined', 'object', 'boolean', 'bool', 'number', 'str', 'string', 
// 'symbol', 'function', 'integer', 'int', 'array'
new Type({
    type       : '...', // required
    message    : `This value should be of type '{{ type }}'.`,
});
```

