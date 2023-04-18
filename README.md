![example workflow](https://github.com/stopsopa/validator/actions/workflows/playwright.yml/badge.svg)
[![npm version](https://badge.fury.io/js/%40stopsopa%2Fvalidator.svg)](https://badge.fury.io/js/%40stopsopa%2Fvalidator)
[![NpmLicense](https://img.shields.io/npm/l/@stopsopa/validator.svg)](https://github.com/stopsopa/validator/blob/master/LICENSE)

## Table of Contents

<!-- toc -->

- [Motivation](#motivation)
- [Loosely inspired by:](#loosely-inspired-by)
- [Live example:](#live-example)
- [Simple example:](#simple-example)
- [Some basic facts about functioning of the validator](#some-basic-facts-about-functioning-of-the-validator)
- [Example](#example)
  * [Entity manager](#entity-manager)
  * [Controller](#controller)
- [Validators references](#validators-references)
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
- [Addidional tools](#addidional-tools)
- [Other similar libraries:](#other-similar-libraries)
- [next generation](#next-generation)
- [Conclusions:](#conclusions)

<!-- tocstop -->

_(TOC generated using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

# Motivation

I haven't found good enough implementation of JSR-303 Bean Validation for javascript, so here we go:

Main goals during implementation of this library was:

- simple and robust architecture
- asynchronous behaviour (due to asynchronous nature of javascript)
- extendability (custom asynchronous validator)
- validation of any data structure and easyness in use (guaranteed by following JSR-303)
- well tested (different node versions and browsers - done with "jest" and "karma") for polymorphic use on server and in the browser

Feel free to contribute.

---

---

# Loosely inspired by:

- https://symfony.com/doc/current/components/validator.html
- https://beanvalidation.org/1.0/spec/

# Live example:

[https://codesandbox.io/s/ymwky9603j](https://codesandbox.io/s/ymwky9603j)

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
  ValidatorLogicError,
} from "@stopsopa/validator";

(async () => {
  const errors = await validator(
    {
      name: "",
      surname: "doe",
      email: "",
      terms: false,
      comments: [
        {
          comment: "What an ugly library",
        },
        {
          comment: "empty",
        },
      ],
    },
    new Collection({
      name: new Required([new NotBlank(), new Length({ min: 3, max: 255 })]),
      surname: new Required([new NotBlank(), new Length({ min: 10, max: 255 })]),
      email: new Required(new Email()),
      terms: new Optional(new IsTrue()),
      comments: new All(
        new Collection({
          comment: new Required(new Length({ min: 10 })),
        })
      ),
    })
  );

  if (errors.count()) {
    // ... handle errors

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
  }
})();
```

# Some basic facts about functioning of the validator

- validator() don't care if some validation errors will occur or not, it will just count them and return two methods to extract them in different formats (as it is visible in above example)
- validator() always return a promise. Rejected promise returned when special ValidatorLogicError() is thrown in Callback type validator only. Only this kind of error is different because it's not "validation error" but actual error in the process of validation - that's a different thing. Usually it's not something user can "fix" in his form or in his UI -> this is rather system error that should be logged and addressed by developers.
- normally all validators are executed in single [Promise.allSettled()](https://github.com/stopsopa/validator/blob/fa760a89089cfe5e5b10770ace849ebf7adb08e5/validator/index.js#L57) but there is a way to group sets of validators into separate Promise.allSettled() (using integer "[async](https://github.com/stopsopa/validator/blob/fa760a89089cfe5e5b10770ace849ebf7adb08e5/test/validator.test.js#L141)" extra flag) and execute those groups one by one. This is where another "extra" flag called "stop" of individual validators comes handy because turning it ON on particular validator will result in not executing next Promise.allSettled() in case when error was detected by that single validator -> so returning resolved or rejected promise from individual validators together with stearing it through flag "stop" serves rather as an flow control mechanizm.
- read [Conclusions](https://github.com/stopsopa/validator/blob/master/README.md#conclusions) section of this readme

# Example

## Entity manager

```javascript
const abstract = require("@stopsopa/knex-abstract");

const extend = abstract.extend;

const prototype = abstract.prototype;

const log = require("inspc");

const a = prototype.a;

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
} = require("@stopsopa/validator");

const ext = {
  initial: async function () {
    return {
      updated: this.now(),
      created: this.now(),
      port: 80,
    };
  },
  toDb: (row) => {
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
        new Length({ max: 50 }),
        new Callback(
          (value, context, path, extra) =>
            new Promise(async (resolve, reject) => {
              const { cluster, node, id } = context.rootData;

              const condition = node === null ? "is" : "=";

              let c;

              log(mode);

              if (mode === "create") {
                c = await this.queryColumn(
                  true,
                  `select count(*) c from :table: where cluster = :cluster and node ${condition} :node`,
                  {
                    cluster,
                    node,
                  }
                );
              } else {
                c = await this.queryColumn(
                  true,
                  `select count(*) c from :table: where cluster = :cluster and node ${condition} :node and id != :id`,
                  {
                    cluster,
                    node,
                    id,
                  }
                );
              }

              log.dump(c);

              const code = "CALLBACK-NOTUNIQUE";

              if (c > 0) {
                context
                  .buildViolation("Not unique")
                  .atPath(path)
                  .setParameter("{{ callback }}", "not equal")
                  .setCode(code)
                  .setInvalidValue(`cluster: '${cluster}' and node: '${node}'`)
                  .addViolation();

                if (extra && extra.stop) {
                  return reject("reject " + code);
                }
              }

              resolve("resolve " + code);
            })
        ),
      ]),
      domain: new Required([new NotBlank(), new Length({ max: 50 })]),
      port: new Required([new NotBlank(), new Length({ max: 8 }), new Regex(/^\d+$/)]),
    };

    if (typeof entity.node !== "undefined") {
      if (entity.node === null) {
        validators.node = new Optional();
      } else {
        validators.node = new Required([new NotBlank(), new Length({ max: 50 })]);
      }
    }

    return new Collection(validators);
  },
};

module.exports = (knex) => extend(knex, prototype, Object.assign({}, require("./abstract"), ext), "clusters", "id");
```

## Controller

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

# Validators references

## Blank

Source code [Blank.js](validator/constraints/Blank.js)

```javascript
new Blank({
  message: "This value should be blank.",
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
  choices: ["..."], // required

  multiple: false,
  min: 0, // only if multiple=true
  max: 0, // only if multiple=true

  message: "The value you selected is not a valid choice.",
  multipleMessage: "One or more of the given values is invalid.",
  minMessage: "You must select at least {{ limit }} choice.|You must select at least {{ limit }} choices.",
  maxMessage: "You must select at most {{ limit }} choice.|You must select at most {{ limit }} choices.",
});

// or shorter syntax if ony choices are given:

new Choice(["..."]); // just choices
```

## Collection

Source code [Collection.js](validator/constraints/Collection.js)

```javascript
new Collection({
  fields: {
    // required type: non empty object
    a: new Require(),
    b: new Optional(),
  },
  allowExtraFields: false,
  allowMissingFields: false,
  extraFieldsMessage: "This field was not expected.",
  missingFieldsMessage: "This field is missing.",
});

// or shorter syntax if only fields are given:

new Collection({
  // required type: non empty object
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

  minMessage:
    "This collection should contain {{ limit }} element or more.|This collection should contain {{ limit }} elements or more.",
  maxMessage:
    "This collection should contain {{ limit }} element or less.|This collection should contain {{ limit }} elements or less.",
  exactMessage:
    "This collection should contain exactly {{ limit }} element.|This collection should contain exactly {{ limit }} elements.",
});

// or shorter syntax if ony min and max given and min = max:

new Count(5);
```

## Email

Source code [Email.js](validator/constraints/Email.js)

```javascript
new Email({
  message: "This value is not a valid email address.",
});
```

## IsFalse

Source code [IsFalse.js](validator/constraints/IsFalse.js)

```javascript
new IsFalse({
  message: "This value should be false.",
});
```

## IsTrue

Source code [IsTrue.js](validator/constraints/IsTrue.js)

```javascript
new IsTrue({
  message: "This value should be true.",
});
```

## IsNull

Source code [IsNull.js](validator/constraints/IsNull.js)

```javascript
new IsNull({
  message: "This value should be null.",
});
```

## Length

Source code [Length.js](validator/constraints/Length.js)

```javascript
new Length({
  // min; // min or max required (or both)
  // max, // min or max required (or both)

  maxMessage:
    "This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.",
  minMessage:
    "This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.",
  exactMessage:
    "This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.",
});
```

## NotBlank

Source code [NotBlank.js](validator/constraints/NotBlank.js)

```javascript
new NotBlank({
  message: "This value should not be blank.",
});
```

## NotNull

Source code [NotNull.js](validator/constraints/NotNull.js)

```javascript
new NotNull({
  message: "This value should not be blank.",
});
```

## Regex

Source code [Regex.js](validator/constraints/Regex.js)

```javascript
new Regex({
  pattern: /abc/gi, // required, type regex
  message: "This value is not valid.",
  match: true, // true     - if value match regex then validation passed
  // false    - if value NOT match regex then validation passed
});
```

## Type

Source code [Type.js](validator/constraints/Type.js)

```javascript
// available values for field 'type' are:
// 'undefined', 'object', 'boolean', 'bool', 'number', 'str', 'string',
// 'symbol', 'function', 'integer', 'int', 'array'
new Type({
  type: "...", // required
  message: `This value should be of type '{{ type }}'.`,
});

// or shorter syntax if ony type is given:

new Type("str");
```

# Addidional tools

    require('@stopsopa/validator/set')
    require('@stopsopa/validator/get')
    require('@stopsopa/validator/delay')
    require('@stopsopa/validator/each')
    require('@stopsopa/validator/size')

# Other similar libraries:

- [express-validator](https://express-validator.github.io/docs/)

# next generation

- or validator
- condition validator
- respecting order of validators - executing in the same order as declared

# Conclusions:

1.

Always use types for primitives and collections:

example cases:

- Length validator fires only if given data type is string (use Type('str') to avoid issues)
- Collection validator validates only if given data is object (use Type('object') to avoid issues)

```js

(async function () {
    const errors = await validator(6, new Collection({
    // collection fires only if given data is object
    // here it is integer
        a: new Type('str'),
        b: new Length({
             min: 1,
             max: 2,
          })
        ])
    }));

    const raw = errors.getRaw();

    expect(raw).toEqual([]);
    //

    done();
})();

```

fixed:

```js
(async function () {
  const errors = await validator(
    undefined, // will generate error: "This value should be of type 'object'."
    // {a: '', b: 7}, // will generate error: "This value should be of type 'str'." on field "b"
    new Required([
      new Type("object"), // this solves the problem on that level
      new Collection({
        a: new Type("str"),
        b: new Required([
          new Type("str"), // this solves the problem on that level
          new Length({
            min: 1,
            max: 2,
          }),
        ]),
      }),
    ])
  );

  const raw = errors.getRaw();

  expect(raw).toEqual([[undefined, "This value should be of type 'object'.", "INVALID_TYPE_ERROR", undefined]]);

  done();
})();
```

2.

Don't relay on new Optional on the root level, more about: /validator/blob/master/test/edge/option_require_case.test.js
