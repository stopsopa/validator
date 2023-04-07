
'use strict';

const isObject          = require('../utils/isObject');

const isArray           = require('../utils/isArray');

const Constraint        = require('../prototypes/Constraint');



const def = {
    message         : 'The value you selected is not a valid choice.',
    multipleMessage : 'One or more of the given values is invalid.',
    minMessage      : 'You must select at least {{ limit }} choice.|You must select at least {{ limit }} choices.',
    maxMessage      : 'You must select at most {{ limit }} choice.|You must select at most {{ limit }} choices.',
    multiple        : false,
    // choices         : []
    // max,
    // min;
};

const Choice = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (isArray(opt)) {

        opt = {
            choices: opt,
        }
    }

    opt = Object.assign({}, def, opt);

    if ( ! isArray(opt.choices) || opt.choices.length === 0) {

        throw new Error(`Choice: choices have to be non empty list`);
    }

    this.setOptions(opt);
}

Choice.prototype = Object.create(Constraint.prototype);

Choice.prototype.constructor = Choice;

Choice.prototype.NO_SUCH_CHOICE_ERROR   = 'NO_SUCH_CHOICE_ERROR';
Choice.prototype.TOO_FEW_ERROR          = 'TOO_FEW_ERROR';
Choice.prototype.TOO_MANY_ERROR         = 'TOO_MANY_ERROR';

const promise = (extra, f) => {
    if (extra && extra.stop) {

        return Promise.reject('stop Choice'+f);
    }

    return Promise.resolve('resolve Choice'+f);
};

Choice.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value === null) {

        return Promise.resolve('Choice');
    }

    if (opt.multiple) {

        if ( isArray(value) ) {

            const count = value.length;

            for (let i = 0, l = count ; i < l ; i += 1 ) {

                if (opt.choices.indexOf(value[i]) === -1) {

                    context
                        .buildViolation(opt.multipleMessage)
                        .atPath(path + '.' + i)
                        .setParameter('{{ value }}', value[i])
                        .setInvalidValue(value)
                        .setCode(Choice.prototype.NO_SUCH_CHOICE_ERROR)
                        .setExtra(extra)
                        .addViolation()
                    ;

                    return promise(extra, 2);
                }
            }

            if (typeof opt.min !== 'undefined' && count < opt.min) {

                context
                    .buildViolation(opt.minMessage)
                    .atPath(path)
                    .setParameter('{{ limit }}', opt.min)
                    .setPlural( (opt.min === 1) ? 0 : 1)
                    .setInvalidValue(value)
                    .setCode(Choice.prototype.TOO_FEW_ERROR)
                    .setExtra(extra)
                    .addViolation()
                ;

                return promise(extra, 2);
            }

            if (typeof opt.max !== 'undefined' && count > opt.max) {

                context
                    .buildViolation(opt.maxMessage)
                    .atPath(path)
                    .setParameter('{{ limit }}', opt.max)
                    .setPlural( (opt.max === 1) ? 0 : 1)
                    .setInvalidValue(value)
                    .setCode(Choice.prototype.TOO_MANY_ERROR)
                    .setExtra(extra)
                    .addViolation()
                ;

                return promise(extra, 3);
            }
        }
    }
    else if (opt.choices.indexOf(value) === -1) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            .setParameter('{{ value }}', value)
            .setInvalidValue(value)
            .setCode(Choice.prototype.NO_SUCH_CHOICE_ERROR)
            .setExtra(extra)
            .addViolation()
        ;

        return promise(extra, 4);
    }

    return Promise.resolve('Choice1');
};

module.exports = Choice;