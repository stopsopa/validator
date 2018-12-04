/*!
 * @author Szymon Działowski
 * @homepage https://github.com/stopsopa/validator
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["spvalidation"] = factory();
	else
		root["spvalidation"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isObject = __webpack_require__(2);

function Constraint() {

    if ( ! (this instanceof Constraint) ) {

        throw "It is necessary to use operator 'new' with all constraints"
    }
};

const sufix         = '_ERROR';

const sufix_length  = sufix.length;

Constraint.prototype.errorNames = function () {

    if ( ! Constraint.prototype._errorNames ) {

        Constraint.prototype._errorNames = Object.keys(this.constructor.prototype).reduce((acc, key) => {

            const val = this.constructor.prototype[key];

            if (
                typeof val === 'string'
                && key === key.toUpperCase()
                && key.substring(key.length - sufix_length) === sufix
            ) {
                acc[key] = key;
            }

            return acc;
        }, {});
    }

    return Constraint.prototype._errorNames;
}

Constraint.prototype.getOptions = function () {

    return this.opt;
}
Constraint.prototype.setOptions = function (opt) {

    this.opt = opt;

    return this;
}

Constraint.prototype.setExtra = function (extra) {

    this.extra = extra;

    return this;
}
Constraint.prototype.getExtra = function () {

    return this.extra;
}

// Constraint.prototype.validate = function (value, context) {}
Constraint.prototype.validate = false;

// Constraint.prototype.validateChildren = function (value, context) {}
Constraint.prototype.validateChildren = false;

module.exports = Constraint;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

module.exports = isArray

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

module.exports = isObject;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint = __webpack_require__(0);

const Existence = function () {
    Constraint.apply(this, arguments); // call super constructor.
};

Existence.prototype = Object.create(Constraint.prototype);
Existence.prototype.constructor = Existence;

module.exports = Existence;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Existence         = __webpack_require__(3);

const Constraint        = __webpack_require__(0);

const All               = __webpack_require__(5);

const isArray           = __webpack_require__(1);

const each              = __webpack_require__(6);

const connectAndSort = function (value, constraints, context, path, final = false) {

    if ( constraints instanceof Existence ) {

        return connectAndSort(value, constraints.getOptions(), context, path, final);
    }

    if (constraints instanceof Constraint) {

        constraints = [constraints];
    }

    if ( ! isArray(constraints) ) {

        if (final) {

            return context.getTriggers();
        }

        return;
    }

    let extra;

    for (let i = 0, l = constraints.length ; i < l ; i += 1 ) {

        if (constraints[i] instanceof Existence) {

            connectAndSort(value, constraints[i].getOptions(), context, path)
        }
        else if (constraints[i] instanceof All) {

            const combine = path ? (name => path + '.' + name) : (name => name);

            const allConstraints = constraints[i].getOptions();

            each(value, (v, name) => {

                connectAndSort(v, allConstraints, context, combine(name));
            });
        }
        else {

            (function (extra) {

                context.addTrigger(
                    extra ? extra.async : 0,
                    () => constraints[i].validate(
                        value,
                        context,
                        path,
                        extra,
                    )
                );

            }(constraints[i].getExtra()));

            if (constraints[i].validateChildren) {

                (function (extra) {

                    constraints[i].validateChildren(value, context, path, extra);

                }(constraints[i].getExtra()));
            }
        }
    }

    if (final) {

        return context.getTriggers();
    }
}

module.exports = connectAndSort;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const All = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    this.setOptions(opt);
}

All.prototype = Object.create(Constraint.prototype);
All.prototype.constructor = All;

module.exports = All;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isArray = __webpack_require__(1);

const isObject = __webpack_require__(2);

module.exports = function each(obj, fn, context) {
    var r;
    if (isArray(obj)) {
        for (var i = 0, l = obj.length ; i < l ; ++i) {
            if (fn.call(context, obj[i], i) === false) {
                return;
            }
        }
    }
    else if (isObject(obj)) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (fn.call(context, obj[i], i) === false) {
                    return;
                }
            }
        }
    }
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Existence         = __webpack_require__(3);

const Constraint         = __webpack_require__(0);

const Required = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    this.setOptions(opt);
}

Required.prototype = Object.create(Existence.prototype);
Required.prototype.constructor = Required;

module.exports = Required;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Existence         = __webpack_require__(3);

const Constraint         = __webpack_require__(0);

const Optional = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    this.setOptions(opt);
}

Optional.prototype = Object.create(Existence.prototype);
Optional.prototype.constructor = Optional;

module.exports = Optional;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isObject          = __webpack_require__(2);

const isArray           = __webpack_require__(1);

const Constraint        = __webpack_require__(0);

const def = {
    message    : 'This value should be blank.',
};

const Blank = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

Blank.prototype = Object.create(Constraint.prototype);

Blank.prototype.constructor = Blank;

Blank.prototype.NOT_BLANK_ERROR = 'NOT_BLANK_ERROR';

Blank.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    let blank = Blank.prototype.logic(value);

    if ( ! blank ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(Blank.prototype.NOT_BLANK_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop Blank');
        }
    }

    return Promise.resolve('resolve Blank');
};

Blank.prototype.logic = function (value) {

    let notblank = true;

    switch (true) {
        case (!value): // covers: false, null, undefined, '', 0, NaN
        case (value === '0'): // covers: '0'
        case (isArray(value) && value.length === 0):
        case (isObject(value) && Object.keys(value).length === 0):
            notblank = false;
            break;
    }

    return !notblank;
}

module.exports = Blank;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Context           = __webpack_require__(11);

const connectAndSort    = __webpack_require__(4);

const delay             = __webpack_require__(15);

const log               = __webpack_require__(16);

/**
 * import validator, { test } from '@stopsopa/validator';
 *
 * @param data
 * @param constraints
 * @param options
 * @returns {string}
 */

const validator = (value, constraints, extra, debug) => {

    const context       = new Context(value, extra);

    const connected     = connectAndSort(value, constraints, context, extra ? extra.path : undefined, true);

    let promise = Promise.resolve();

    while (connected.length) {

        (function (list) {

            promise = promise
                .then(() => Promise.all(list.map(c => c())))
            ;

            if (debug > 1) {

                promise = promise
                    .then(...delay.then(2500))
                ;
            }

            if (debug > 0) {

                promise = promise
                    .then(a => {
                        console.log('debug resolved:', JSON.stringify(a));
                        return a;
                    }, a => {
                        console.log('debug rejected:', JSON.stringify(a));
                        return a;
                    })
                ;
            }

        }(connected.shift()));
    }

    const end = () => context.getViolations();

    return promise.then(end, end);
}

validator.Required      = __webpack_require__(7);
validator.Optional      = __webpack_require__(8);
validator.Collection    = __webpack_require__(20);
validator.All           = __webpack_require__(5);
validator.Blank         = __webpack_require__(9);
validator.Callback      = __webpack_require__(22);
validator.Choice        = __webpack_require__(23);
validator.Count         = __webpack_require__(24);
validator.Email         = __webpack_require__(25);
validator.IsFalse       = __webpack_require__(26);
validator.IsNull        = __webpack_require__(27);
validator.IsTrue        = __webpack_require__(28);
validator.Length        = __webpack_require__(29);
validator.NotBlank      = __webpack_require__(30);
validator.NotNull       = __webpack_require__(31);
validator.Regex         = __webpack_require__(32);
validator.Type          = __webpack_require__(33);

module.exports  = validator;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const ViolationBuilder          = __webpack_require__(12);

const ConstraintViolationList   = __webpack_require__(13);

const Context = function (rootData, extra = {}) {

    this.violations = [];

    this.rootData   = rootData;

    this.extra      = extra;

    this.stack      = {};
};

Context.prototype.buildViolation = function () {

    let args = Array.prototype.slice.call(arguments);

    if ( args.length === 0 ) {

        throw `new Context(message).buildViolation(message): message not specified`;
    }

    if (typeof args[0] !== 'string') {

        throw `new Context(message).buildViolation(message): message arg must be string`;
    }

    return new ViolationBuilder(args[0], this);
}
Context.prototype.addViolation = function (path, message, code, invalidValue, extra) {

    const violation = [path, message, code, invalidValue];

    if (typeof extra !== 'undefined') {

        violation.push(extra);
    }

    this.violations.push(violation);
};
Context.prototype.addTrigger = function (async = 0, trigger) {

    if ( this.stack[async] ) {

        this.stack[async].push(trigger);
    }
    else {

        this.stack[async] = [trigger];
    }

    return this;
}
Context.prototype.getTriggers = function () {

    const list = Object.keys(this.stack).sort().reduce((acc, key) => {

        this.stack[key].length && acc.push(this.stack[key]);

        return acc;

    }, []);

    this.stack = {};

    return list;
}
Context.prototype.getViolations = function () {
    return new ConstraintViolationList(this.violations);
}
Context.prototype.getRoot = function () {
    return this.rootData;
}
Context.prototype.getExtra = function () {
    return this.extra;
}

module.exports = Context;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const ViolationBuilder = function (message, context) {
    this.parameters     = {};
    this.code           = undefined;
    this.path           = undefined;
    this.plural         = false;
    this.invalidValue   = undefined;
    this.extra          = undefined;
    this.message        = message;
    this.context        = context;
}
ViolationBuilder.prototype.setParameter = function (name, value) {

    this.parameters[name] = value;

    return this;
}
ViolationBuilder.prototype.setCode = function (code) {

    this.code = code;

    return this;
}
ViolationBuilder.prototype.atPath = function (path) {

    this.path = path;

    return this;
}
ViolationBuilder.prototype.setPlural = function (plural) {

    if ( ! Number.isInteger(plural) || plural < 0 ) {

        throw `ViolationBuilder.setPlural(plural) - plural parameter should be integer in range 0-inifinty`
    }

    this.plural = plural;

    return this;
}
ViolationBuilder.prototype.setInvalidValue = function (invalidValue) {

    this.invalidValue = invalidValue;

    return this;
}
ViolationBuilder.prototype.setExtra = function (extra) {

    this.extra = extra;

    return this;
}
ViolationBuilder.prototype.addViolation = function() {

    if ( this.code === undefined ) {

        throw `ViolationBuilder: this.code === undefined, call ViolationBuilder->setCode(code)`;
    }

    let message = this.message;

    if (typeof message === 'string' && message.indexOf('|') > -1 && this.plural !== false && this.plural > -1) {

        const split = message.split('|');

        if (split.length > this.plural) {

            message = split[this.plural];
        }
    }

    Object.keys(this.parameters).map(key => {

        let cp;

        do {

            cp = message;

            message = message.replace(key, this.parameters[key]);

        } while (cp !== message);
    });

    this.context.addViolation(
        this.path,
        message,
        this.code,
        this.invalidValue,
        this.extra,
    );

    return this;
}

module.exports = ViolationBuilder;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const set       = __webpack_require__(14);

const isArray   = __webpack_require__(1);

/**
 * https://stackoverflow.com/a/14438954
 */
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function ConstraintViolationList (violations) {

    this.violations = violations;
}

ConstraintViolationList.prototype.getRaw = function () {

    return this.violations.map(v => {

        if (v.length > 4) {

            v.pop();
        }
        return v;
    });
}

ConstraintViolationList.prototype.getFlat = function (all = false) {

    let key;

    const list = this.violations.reduce((acc, v) => {

        key = v[0] || '';

        if ( ! acc[key] ) {

            acc[key] = [];
        }

        acc[key].push(v);

        return acc;
    }, {});

    return Object.keys(list).reduce((acc, key) => {

        acc[key] = list[key];

        acc[key].sort(function (aa, bb, a = 0, b = 0) {

            if (typeof aa[4] === 'number')  {

                a = aa[4];
            }
            else if (aa[4] && typeof aa[4].order !== 'undefined') {

                a = aa[4].order;
            }

            if (typeof bb[4] === 'number')  {

                b = bb[4];
            }
            else if (bb[4] && typeof bb[4].order !== 'undefined') {

                b = bb[4].order;
            }

            return b - a;
        });

        acc[key] = acc[key].map(v => v[1]);

        if ( ! all ) {

            acc[key] = acc[key].shift();
        }

        return acc;
    }, {});
}

ConstraintViolationList.prototype.getTree = function (all = false) {

    const raw = this.getFlat(all);

    return Object.keys(raw).reduce((acc, key) => {

        acc = set(acc, key, raw[key]);

        return acc;

    }, {});
}

ConstraintViolationList.prototype.findByCodes = function (codes) {

    if ( ! isArray(codes) ) {

        codes = [codes]
    }

    codes = codes.filter(onlyUnique);

    let tmp = [];

    for (let i = 0, l = codes.length ; i < l ; i += 1 ) {

        tmp = tmp.concat(this.violations.filter(v => v[2] === codes[i]));
    }

    return tmp;
}
ConstraintViolationList.prototype.count = function () {
    return this.violations.length;
}

module.exports = ConstraintViolationList;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isArray = __webpack_require__(1);

const isObject = __webpack_require__(2);

function set(source, key, value) {

    if (typeof key === 'string') {

        key = key.split('.');
    }

    if (typeof key === 'number') {

        key = key + '';
    }

    if ( isObject(key) ) {

        key = Object.values(key).map(a => a += '');
    }

    if (typeof key !== 'string' && ! key && key !== '0' && key !== '') {

        key = [];
    }

    if ( ! isArray(key) ) {

        key = [key];
    }

    if (key.length) {

        let first = true;

        let ar = isArray(source);

        if ( ! ar && ! isObject(source) ) {

            source = {};
        }

        let kt;

        let tmp     = source;

        let tmp2    = source;

        let obb, arr;

        while (key.length) {

            kt = key.shift();

            if (first) {

                first = false;

                if ( ar && !/^\d+$/.test(kt) && kt !== '') {

                    throw `if source is array and key is not integer nor empty string then its not possible to add to array, given key: ` + JSON.stringify(kt)
                }
            }

            tmp = tmp2;

            if ( key.length ) {

                obb = isObject(tmp[kt]);

                arr = isArray(tmp[kt]);

                if ( ! ( obb || arr ) ) {

                    if (key[0] === '') {

                        arr || (tmp[kt] = []);
                    }
                    else {

                        obb || (tmp[kt] = {});
                    }
                }

                tmp2 = tmp[kt];
            }
            else {

                if (isArray(tmp)) {

                    if (kt === '') {

                        tmp.push(value);
                    }
                    else {

                        tmp[kt] = value
                    }
                }
                else {

                    tmp[kt] = value;
                }

                return source;
            }
        }
    }

    return value;
}

module.exports = set;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
    return Promise.resolve()
        .then(() => delay(3000, 'ok'))

 */
const delay = (time, data) =>
    new Promise(
        resolve => time ? setTimeout(resolve, time, data) : resolve(data)
    )
;
/**
    return Promise.resolve()
        .then(
            () => delay(3000, 'ok')
            () => delay.reject(3000, 'error')
        )

 */
const reject = (time, data) =>
    new Promise(
        (resolve, reject) => time ? setTimeout(reject, time, data) : reject(data)
    )
;

/**
 * Promise.reject('test')
 *     .then(...then(1000))
 *     .catch(data => console.log(data))
 * ;
 * Promise.resolve('test')
 *     .then(...then(1000))
 *     .then(data => console.log(data))
 * ;
 * @param time
 */

const then = time => ([
    data => delay(time, data),
    data => delay.reject(time, data)
]);

delay.reject    = reject;

delay.then      = then;

module.exports = delay;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */


// -- test --- vvv

// const log = require('./logn');
//
// (function () {
//
//     (function () {
//
//         console.log('------------ 1');
//
//         log('one')('two')('three');
//
//         console.log('------------ 2');
//
//         log('-test-')('+test+')('testddd')('next');
//
//         console.log('------------ 3');
//
//         log.stack(2)('-test-')('+test+')('testddd')('next');
//
//         console.log('------------ 4');
//
//         log.stack(0).log('stack 0', 'two');
//
//         log.stack(1).log('stack 1', 'two');
//
//         log.stack(2).log('stack 2', 'two');
//
//         console.log('------------ stack default 2');
//
//         log.stack(0)('-test-')('+test+')('testddd')('next');
//
//         console.log('------------ json');
//
//         log.json({one: "two", three: [5, 'eight']})
//
//         log.stack(2).json({one: "two", three: [5, 'eight']})({one: "two", three: [5, 'eight']})
//
//         console.log('------------ dump');
//
//         // only one arg
//         log.dump({one: "two", three: [5, 'eight']}, 2 /* show levels (must be int > 0) */);
//
//         console.log('------------ stack dump ');
//
//         // in second cascade call 'level' is not necessary (stil .dump() accept only one ar
//         log.stack(2).dump({one: "two", three: [5, 'eight']}, 2)({one: "two", three: [5, 'eight']})
//
//
//     }());
//
// }());

// -- test --- ^^^




/**
 * log(arg1, arg2, ...)(arg1, arg2, ...)  - line and args
 * log.json(arg1, arg2, ...)(arg1, arg2, ...) - line and args as human readdable json
 * log.dump(arg1, arg2, ...)(arg1, arg2, ...) - line and args (exact description of types)
 *
 * log.stack(5)(arg1, arg2, ...)(arg1, arg2, ...)  - line and args
 * log.stack(5).json(arg1, arg2, ...)(arg1, arg2, ...) - line and args as human readdable json
 * log.stack(5).dump(arg1, arg2, ...)(arg1, arg2, ...) - line and args (exact description of types)
 *
 * and...
 * var tmp = log.stack(4)('test')
 *
 * tmp('test2')
 *
 * gives:
 * /opt/spark_dev/crawler.js:47
 * test
 * /opt/spark_dev/crawler.js:47
 * test2
 *
 * buffering (returning output as a string)
 *

 log.start();

 log.dump('test1');

 log('test2');

 // true or false to additionally flush data to screen after return (def false)
 const tmp = log.get(true);
 */


// web version

const node = typeof global !== 'undefined' && Object.prototype.toString.call(global.process) === '[object process]';

if ( ! node ) {

    module.exports = __webpack_require__(19);
}


// logic from https://github.com/gavinengel/magic-globals/blob/master/index.js
node && (function () {
    global.__stack || Object.defineProperty(global, '__stack', {
        get: function tmp() {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function(_, stack){ return stack; };
            var err = new Error;
            Error.captureStackTrace(err, tmp);
            // Error.captureStackTrace(err, arguments.callee); // without 'use strict'
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return stack;
        }
    });
}());

/** returns line number when placing this in your code: __line */
// Object.defineProperty(global, '__line', {
//     get: function(){
//         return String("     " + __stack[2].getLineNumber()).slice(-5);
//     }
// });

// /** return filename (without directory path or file extension) when placing this in your code: __file */
// Object.defineProperty(global, '__file', {
//     get: function(){
//         return __stack[2].getFileName();
//     }
// });

if (node) {

    global.__line = (function () {

        function rpad(s, n) {

            (typeof n === 'undefined') && (n = 5);

            try {

                if (s && s.length && s.length >= n) {

                    return s;
                }
            }
            catch (e) {
                console && console.log && console.log('exception', typeof s, s, e);
            }

            return String(s + " ".repeat(n)).slice(0, n);
        }

        var tool = function (n) {

            if (typeof n === 'undefined') {

                let tmp = [];

                for (let i in __stack) {

                    if (__stack.hasOwnProperty(i)) {

                        tmp.push('stack: ' + rpad(i) + ' file:' + __stack[i].getFileName() + ':' + rpad(__stack[i].getLineNumber()) + ' ');
                    }
                }

                return tmp;
            }

            (typeof n === 'undefined') && (n = 1);

            if ( ! __stack[n] ) {

                return `${n} not in stack: ` + tool(n - 1);
            }

            const file = __stack[n].getFileName();

            if (file === null) {

                return 'corrected:' + tool(n - 1);
            }

            return (new Date()).toISOString().substring(0, 19).replace('T', ' ') + ' ' + file + ':' + rpad(__stack[n].getLineNumber());
        };

        return tool;
    }());
}

var manualMode = false;

var native = (function () {

    const nat = (function () {

        try {
            return function () {
                Array.prototype.slice.call(arguments, 0).forEach(m => {
                    if (typeof m === 'string') {

                        process.stdout.write(`\n${m}`)

                        return;
                    }
                    m = JSON.stringify(m, null, '    ');

                    process.stdout.write(`\n${m}`);
                })
            };
            // return console.log.bind(console);
        }
        catch (e) {

            return function () {};
        }
    }());

    let
        emmit = true,
        cache = [];
    ;

    const tool = function () {

        const args = Array.prototype.slice.call(arguments, 0);

        if (emmit) {

            nat.apply(this, args);
        }
        else {

            cache = cache.concat(args);
        }
    }

    tool.start = function () {

        if (manualMode) {

            return tool;
        }

        emmit = true;

        tool.flush();

        emmit = false;

        return tool;
    };

    tool.get = function (flush) {

        (flush === undefined) && (flush = false);

        manualMode = false;

        var data = cache.join("\n");

        if ( ! flush ) {

            cache = [];
        }

        tool.flush();

        return data;
    };

    tool.flush = function () {

        if (manualMode) {

            return tool;
        }

        emmit = true;

        if (emmit && cache.length) {

            tool.call(this, cache.join("\n"));
        }

        cache = [];

        return tool;
    };

    return tool;
}());

var stack = false;

function log() {

    var s = (stack === false) ? 0 : stack;

    native(__line(s + 2));

    if (this !== true) {

        s += 1;
    }

    stack = false;

    native.apply(this, Array.prototype.slice.call(arguments, 0));

    return function () {

        return log.stack(s).apply(true, Array.prototype.slice.call(arguments, 0));
    };
};

log.native = native;

log.log = function () {
    return log.apply(this, Array.prototype.slice.call(arguments, 0));
};

log.start = function () {

    native.start();

    manualMode = true;

    return function () {

        return log.stack(s).apply(true, Array.prototype.slice.call(arguments, 0));
    };
}

log.get = function (flush) {
    return native.get(flush);
}

log.json = function () {

    var s = (stack === false) ? 0 : stack;

    native(__line(s + 2));

    if (this !== true) {

        s += 1;
    }

    stack = false;

    native.start();

    Array.prototype.slice.call(arguments).forEach(function (a) {
        return (JSON.stringify(a, null, '  ') + '').split(/\n/g).forEach(function (l) {
            native(l);
        });
    });

    native.flush();

    return function () {

        return log.stack(s).json.apply(true, Array.prototype.slice.call(arguments, 0));
    };
};

log.stack = function (n /* def: 0 */) {

    if (n === false) {

        stack = n;

        return log;
    }

    var nn = parseInt(n, 10);

    if (!Number.isInteger(n) || n < 0) {

        throw "Can't setup stack to '" + nn + "' ("+n+")";
    }

    stack = nn;

    return log;
};

(function (ll) {

    // http://stackoverflow.com/a/16608045/5560682
    function isObject(a) {
        // return (!!a) && (a.constructor === Object);
        return Object.prototype.toString.call(a) === '[object Object]'; // better in node.js to dealing with RowDataPacket object
    };
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var type = (function (t) {
        return function (n) {

            if (n === undefined) {

                return 'Undefined';
            }

            if (n === null) {

                return 'Null';
            }

            t = typeof n;

            if (t === 'Function') {

                return t;
            }

            if (Number.isNaN(n)) {

                return "NaN";
            }

            if (t === 'number') {

                return (Number(n) === n && n % 1 === 0) ? 'Integer' : 'Float';
            }

            return n.constructor ? n.constructor.name : t;
            // t = Object.prototype.toString.call(n);
            // if (t.indexOf('[object ') === 0) {
            //     t = t.substring(8);
            //     t = t.substring(0, t.length - 1);
            // }
            // return t;
        };
    }());

    function each(obj, fn, context) {
        var r;
        if (isArray(obj)) {
            for (var i = 0, l = obj.length ; i < l ; ++i) {
                if (fn.call(context, obj[i], i) === false) {
                    return;
                }
            }
        }
        else if (isObject(obj) || count(obj)) {
            for (var i in obj) {
                if (obj && obj.hasOwnProperty && obj.hasOwnProperty(i)) {
                    if (fn.call(context, obj[i], i) === false) {
                        return;
                    }
                }
            }
        }
    }

    function toString(o, k) {

        if (typeof o === 'function') {

            k = Object.keys(o).join(',');

            return k ? 'object keys:' + k : '';
        }

        return o
    }

    // only for function
    function count (o) {

        if (typeof o === 'function') {

            for (let i in o) {

                if (o && o.hasOwnProperty && o.hasOwnProperty(i)) {

                    return true;
                }
            }
        }

        return false;
    }

    log.dump = function () {

        native.start();

        var args = Array.prototype.slice.call(arguments, 0);

        var limit = args[args.length - 1];

        if (args.length > 1 && Number.isInteger(limit) && limit > 0) {

            args.pop();

            limit -= 1;
        }
        else {

            limit = false;
        }

        function inner(d, l, index) {
            (typeof l === 'undefined') && (l = 0);
            index = (typeof index === 'undefined') ? '' : '<' + index + '> ';
            var isOb = isObject(d) || count(d);
            if (isOb || isArray(d)) {
                ll(('  '.repeat(l)) + index + type(d) + ' ' + ((isOb) ? '{' :'[') );
                each(d, function (v, i) {
                    var isOb = isObject(v) || count(v) || isArray(v);
                    if (limit !== false && l >= limit && isOb) {
                        ll(
                            ('  '.repeat(l + 1)) +
                            ((typeof i === 'undefined') ? '' : '<' + i + '> ') +
                            '[' + type(v) + ']: ' +
                            '>>more<<'
                        );
                        // inner('... more: ' + type(v), l + 1, i);
                    }
                    else {
                        inner(v, l + 1, i);
                    }
                });
                ll(('  '.repeat(l)) + ((isOb) ? '}' :']') );
            }
            else {
                var t = type(d);
                var c = toString(d);
                ll(
                    ('  '.repeat(l)) +
                    index +
                    '[' + t + ']: ' +
                    '>' + c + '<' +
                    ( (t === 'String') ? ' len: ' + c.length : '')
                );
            }
        }

        var s = (stack === false) ? 0 : stack;

        native(__line(s + 2));

        if (this !== true) {
            s += 1;
        }

        stack = false;

        args.forEach(function (d) {
            inner(d);
        });

        native.flush();

        return function () {

            var args = Array.prototype.slice.call(arguments, 0);

            if (limit !== false) {

                args = args.concat(limit + 1);
            }

            return log.stack(s).dump.apply(true, args);
        };
    };

}(native));

if (node) {

    module.exports = log;
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(17), __webpack_require__(18)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */



const log = (function () {
    try {
        if (console.log) {
            return function () {
                try {
                    console.log.apply(this, Array.prototype.slice.call(arguments));
                }
                catch (e) {
                }
                return log;
            }
        }
    }
    catch (e) {
        return function () {return log};
    }
}());

log.stack = function () {return log};

module.exports = log.dump = log.start = log.get = log.json = log.log = log;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const arrayIntersect    = __webpack_require__(21);

const isObject          = __webpack_require__(2);

const Constraint        = __webpack_require__(0);

const Existence         = __webpack_require__(3);

const Required          = __webpack_require__(7);

const Optional          = __webpack_require__(8);

const connectAndSort    = __webpack_require__(4);

const isArray           = __webpack_require__(1);

const each              = __webpack_require__(6);

const def = {
    fields                  : {},
    allowExtraFields        : false,
    allowMissingFields      : false,
    extraFieldsMessage      : 'This field was not expected.',
    missingFieldsMessage    : 'This field is missing.',
};

const Collection = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if ( ! isObject(opt) || opt instanceof Constraint) {

        throw `Collection accept only plain object as a first argument`;
    }

    if (isObject(opt) && arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0) {

        opt = Object.assign({}, def, {
            fields  : opt,
        });
    }
    else {

        opt = Object.assign({}, def, opt);
    }

    if ( Object.keys(opt.fields).length === 0) {

        throw `Describe at least one field in "fields" parameter`;
    }

    opt.fields = Object.keys(opt.fields).reduce((acc, field) => {

        if ( opt.fields[field] instanceof Existence ) {

            acc[field] = opt.fields[field];
        }
        else {

            acc[field] = new Required(opt.fields[field]);
        }

        return acc;
    }, {});

    this.setOptions(opt);
}

Collection.prototype = Object.create(Constraint.prototype);
Collection.prototype.constructor = Collection;

Collection.prototype.MISSING_FIELD_ERROR = 'MISSING_FIELD_ERROR';
Collection.prototype.NO_SUCH_FIELD_ERROR = 'NO_SUCH_FIELD_ERROR';

Collection.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (isObject(value) || isArray(value)) {

        Object.keys(opt.fields).forEach(field => {

            if (typeof value[field] === 'undefined') {

                if ( ! (opt.fields[field] instanceof Optional) && ! opt.allowMissingFields) {

                    context
                        .buildViolation(opt.missingFieldsMessage)
                        .atPath((typeof path === 'undefined') ? field : ( path + '.' + field))
                        .setParameter('{{ field }}', field)
                        .setCode(Collection.prototype.MISSING_FIELD_ERROR)
                        .setInvalidValue(value)
                        .addViolation()
                    ;
                }
            }
        });

        if ( ! opt.allowExtraFields ) {

            each(value, (v, field) => {

                if (typeof opt.fields[field] === 'undefined') {

                    context
                        .buildViolation(opt.extraFieldsMessage)
                        .atPath((typeof path === 'undefined') ? field : ( path + '.' + field))
                        .setParameter('{{ field }}', field)
                        .setCode(Collection.prototype.NO_SUCH_FIELD_ERROR)
                        .setInvalidValue(value)
                        .addViolation()
                    ;
                }
            });
        }
    }

    return Promise.resolve('resolve Collection2');
};

Collection.prototype.validateChildren = function (value, context, path, extra) {

    const opt = this.getOptions();

    let tmp;

    each(value,(v, name) => {
        if (tmp = opt.fields[name]) {
            connectAndSort(
                value[name],
                tmp.getOptions(),
                context,
                path ? (path + '.' + name) : name,
            );
        }
    });
}

module.exports = Collection;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isArray = __webpack_require__(1);

module.exports = (a, b) => {

    if ( ! isArray(a) ) {

        return [];
    }

    if ( ! isArray(b) ) {

        return [];
    }

    return a.reduce((acc, val) => {

        if (b.indexOf(val) > -1) {

            acc.push(val);
        }

        return acc;
    }, []);
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const Callback = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt !== 'function') {

        throw `Callback constraint first arg should be function`;
    }

    this.setOptions(opt);
}

Callback.prototype = Object.create(Constraint.prototype);

Callback.prototype.constructor = Callback;

Callback.prototype.validate = function (value, context, path, extra) {

    const callback = this.getOptions();

    return new Promise((resolve, reject) => {

        let result = callback(value, context, path, extra);

        if ( ! result || typeof result.then !== 'function') {

            result = Promise.resolve();
        }

        result.then(resolve, reject)
    });
};

module.exports = Callback;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isObject          = __webpack_require__(2);

const isArray           = __webpack_require__(1);

const Constraint        = __webpack_require__(0);

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

        throw `Choice: choices have to be non empty list`;
    }

    this.setOptions(opt);
}

Choice.prototype = Object.create(Constraint.prototype);

Choice.prototype.constructor = Choice;

Choice.prototype.NO_SUCH_CHOICE_ERROR   = 'NO_SUCH_CHOICE_ERROR';
Choice.prototype.TOO_FEW_ERROR          = 'TOO_FEW_ERROR';
Choice.prototype.TOO_MANY_ERROR         = 'TOO_MANY_ERROR';

const promise = (extra, f) => (extra && extra.stop) ? Promise.reject('stop Choice'+f) : Promise.resolve('resolve Choice'+f);

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

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isArray          = __webpack_require__(1);

const isObject          = __webpack_require__(2);

const Constraint        = __webpack_require__(0);

const def = {
    minMessage: 'This collection should contain {{ limit }} element or more.|This collection should contain {{ limit }} elements or more.',
    maxMessage: 'This collection should contain {{ limit }} element or less.|This collection should contain {{ limit }} elements or less.',
    exactMessage: 'This collection should contain exactly {{ limit }} element.|This collection should contain exactly {{ limit }} elements.',
    // max,
    // min;
};

function Count() {

    let args = Array.prototype.slice.call(arguments);

    Constraint.apply(this, args); // call super constructor.

    if ( args.length === 0) {

        throw `Count: options must be given for this constraint`;
    }

    let opt = args[0];

    this.setExtra(args[1]);

    if (Number.isInteger(opt)) {

        opt = {
            min: opt,
            max: opt,
        }
    }

    if (isObject(opt)) {

        opt = Object.assign({}, def, opt);
    }
    else {

        throw `Count: Wrong parameter type have been given to this constraint, typeof: ` + (typeof opt);
    }

    if ( typeof opt.min === 'undefined' && typeof opt.max === 'undefined') {

        throw `Count: Either option "min" or "max" must be given for constraint`;
    }

    if ( typeof opt.min !== 'undefined' && ! Number.isInteger(opt.min) ) {

        throw `Count: min should be integer`
    }

    if ( typeof opt.max !== 'undefined' &&  ! Number.isInteger(opt.max) ) {

        throw `Count: max should be integer`
    }

    if ( opt.min < 0 ) {

        throw `Count: min should be greater than 0`;
    }

    if ( opt.max < 0 ) {

        throw `Count: max should be greater than 0`;
    }

    this.setOptions(opt);
}

Count.prototype = Object.create(Constraint.prototype);
Count.prototype.constructor = Count;

Count.prototype.TOO_FEW_ERROR   = 'TOO_FEW_ERROR';
Count.prototype.TOO_MANY_ERROR  = 'TOO_MANY_ERROR';

Count.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    let count = false;

    if (isArray(value)) {

        count = value.length;
    }

    if (count === false && isObject(value)) {

        count = Object.keys(value).length;
    }

    if (count !== false) {

        if (typeof opt.max !== 'undefined' && count > opt.max) {

            context
                .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage)
                .atPath(path)
                .setParameter('{{ count }}', count)
                .setParameter('{{ limit }}', opt.max)
                .setInvalidValue(value)
                .setPlural( (opt.max === 1) ? 0 : 1 )
                .setCode(Count.prototype.TOO_MANY_ERROR)
                .addViolation()
            ;

            return (extra && extra.stop) ? Promise.reject('stop Count') : Promise.resolve('resolve Count');
        }

        if (typeof opt.min !== 'undefined' && count < opt.min) {

            context
                .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage)
                .atPath(path)
                .setParameter('{{ count }}', count)
                .setParameter('{{ limit }}', opt.min)
                .setInvalidValue(value)
                .setPlural( (opt.min === 1) ? 0 : 1 )
                .setCode(Count.prototype.TOO_FEW_ERROR)
                .addViolation()
            ;

            return (extra && extra.stop) ? Promise.reject('stop Count') : Promise.resolve('resolve Count');
        }
    }

    return Promise.resolve('Count');
}

module.exports = Count;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const def = {
    message    : 'This value is not a valid email address.',
};

const Email = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

Email.prototype = Object.create(Constraint.prototype);
Email.prototype.constructor = Email;

Email.prototype.INVALID_EMAIL_ERROR = 'INVALID_EMAIL_ERROR';

Email.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if ( ! Email.prototype.logic(value) ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(Email.prototype.INVALID_EMAIL_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop Email');
        }
    }

    return Promise.resolve('resolve Email');
};

Email.prototype.logic = function (email) {

    if (typeof email === 'string') {

        return /^.+\@\S+\.\S+$/.test(email);
    }

    return false;
}

module.exports = Email;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const def = {
    message    : 'This value should be false.',
};

const IsFalse = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

IsFalse.prototype = Object.create(Constraint.prototype);
IsFalse.prototype.constructor = IsFalse;

IsFalse.prototype.NOT_FALSE_ERROR = 'NOT_FALSE_ERROR';

IsFalse.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value !== false) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(IsFalse.prototype.NOT_FALSE_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop IsFalse');
        }
    }

    return Promise.resolve('resolve IsFalse');
};

module.exports = IsFalse;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const def = {
    message    : 'This value should be null.',
};

const IsNull = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

IsNull.prototype = Object.create(Constraint.prototype);
IsNull.prototype.constructor = IsNull;

IsNull.prototype.NOT_NULL_ERROR = 'NOT_NULL_ERROR';

IsNull.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value !== null) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(IsNull.prototype.NOT_NULL_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop IsNull');
        }
    }

    return Promise.resolve('resolve IsNull');
};

module.exports = IsNull;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const def = {
    message    : 'This value should be true.',
};

const IsTrue = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

IsTrue.prototype = Object.create(Constraint.prototype);
IsTrue.prototype.constructor = IsTrue;

IsTrue.prototype.NOT_TRUE_ERROR = 'NOT_TRUE_ERROR';

IsTrue.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value !== true) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(IsTrue.prototype.NOT_TRUE_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop IsTrue');
        }
    }

    return Promise.resolve('resolve IsTrue');
};

module.exports = IsTrue;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isObject          = __webpack_require__(2);

const Constraint        = __webpack_require__(0);

const def = {
    maxMessage: 'This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.',
    minMessage: 'This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.',
    exactMessage: 'This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.',
    // max,
    // min;
};

function Length() {

    let args = Array.prototype.slice.call(arguments);

    Constraint.apply(this, args); // call super constructor.

    if ( args.length === 0) {

        throw `Length: options must be given for this constraint`;
    }

    let opt = args[0];

    this.setExtra(args[1]);

    if (Number.isInteger(opt)) {

        opt = {
            min: opt,
            max: opt,
        }
    }

    if (isObject(opt)) {

        opt = Object.assign({}, def, opt);
    }
    else {

        throw `Length: Wrong parameter type have been given to this constraint, typeof: ` + (typeof opt);
    }

    if ( typeof opt.min === 'undefined' && typeof opt.max === 'undefined') {

        throw `Length: Either option "min" or "max" must be given for constraint`;
    }

    this.setOptions(opt);
}

Length.prototype = Object.create(Constraint.prototype);
Length.prototype.constructor = Length;

Length.prototype.TOO_SHORT_ERROR            = 'TOO_SHORT_ERROR';
Length.prototype.TOO_LONG_ERROR             = 'TOO_LONG_ERROR';

Length.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (typeof value === 'string') {

        const length = value.length;

        if (typeof opt.max !== 'undefined' && length > opt.max) {

            context
                .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage)
                .atPath(path)
                .setPlural( (opt.max === 1) ? 0 : 1 )
                .setParameter('{{ value }}', value)
                .setParameter('{{ limit }}', opt.max)
                .setInvalidValue(value)
                .setCode(Length.prototype.TOO_LONG_ERROR)
                .setExtra(extra)
                .addViolation()
            ;

            return (extra && extra.stop) ? Promise.reject('stop Length') : Promise.resolve('resolve Length');
        }

        if (typeof opt.min !== 'undefined' && length < opt.min) {

            context
                .buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage)
                .atPath(path)
                .setPlural( (opt.min === 1) ? 0 : 1 )
                .setParameter('{{ value }}', value)
                .setParameter('{{ limit }}', opt.min)
                .setInvalidValue(value)
                .setCode(Length.prototype.TOO_SHORT_ERROR)
                .setExtra(extra)
                .addViolation()
            ;

            return (extra && extra.stop) ? Promise.reject('stop Length') : Promise.resolve('resolve Length');
        }
    }

    return Promise.resolve('Length');
}

module.exports = Length;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const Blank             = __webpack_require__(9);

const def = {
    message    : 'This value should not be blank.',
};

const NotBlank = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

NotBlank.prototype = Object.create(Constraint.prototype);

NotBlank.prototype.constructor = NotBlank;

NotBlank.prototype.IS_BLANK_ERROR = 'IS_BLANK_ERROR';

NotBlank.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    let blank = Blank.prototype.logic(value);

    if ( blank ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(NotBlank.prototype.IS_BLANK_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop NotBlank');
        }
    }

    return Promise.resolve('resolve NotBlank');
};

module.exports = NotBlank;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const def = {
    message    : 'his value should be true.',
};

const NotNull = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (typeof opt === 'string') {

        opt = {
            message: opt,
        }
    }

    this.setOptions(Object.assign({}, def, opt));
}

NotNull.prototype = Object.create(Constraint.prototype);
NotNull.prototype.constructor = NotNull;

NotNull.prototype.IS_NULL_ERROR = 'IS_NULL_ERROR';

NotNull.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if (value === null) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(NotNull.prototype.IS_NULL_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            // return reject('stop Type');
            return Promise.reject('stop NotNull');
        }
    }

    return Promise.resolve('resolve NotNull');
};

module.exports = NotNull;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Constraint        = __webpack_require__(0);

const isObject          = __webpack_require__(2);

const def = {
    message     : 'This value is not valid.',
    match       : true
};

const Regex = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (Regex.prototype.isRegex(opt)) {

        opt = {
            pattern: opt,
        }
    }

    if ( ! isObject(opt) ) {

        throw `Regex: first argument must be regex or object`;
    }

    if ( ! Regex.prototype.isRegex(opt.pattern) ) {

        throw `Regex: 'pattern' is not specified`;
    }

    this.setOptions(Object.assign({}, def, opt));
}

Regex.prototype = Object.create(Constraint.prototype);
Regex.prototype.constructor = Regex;

Regex.prototype.REGEX_FAILED_ERROR = 'REGEX_FAILED_ERROR';

Regex.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if ( ! Regex.prototype.logic(value, opt.pattern, opt.match) ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            // .setParameter('{{ value }}', $this->formatValue($value))
            .setCode(Regex.prototype.REGEX_FAILED_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            return Promise.reject('stop Regex');
        }
    }

    return Promise.resolve('resolve Regex');
};
Regex.prototype.isRegex = function (reg) {
    return Object.prototype.toString.call(reg) === "[object RegExp]"
}
Regex.prototype.logic = function (value, regex, match) {

    if (typeof value === 'string') {

        const ret = regex.test(value);

        return match ? ret : !ret;
    }

    return false;
}

module.exports = Regex;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const isObject          = __webpack_require__(2);

const isArray           = __webpack_require__(1);

const Constraint        = __webpack_require__(0);

const def = {
    message    : `This value should be of type '{{ type }}'.`,
};

const Type = function (opt, extra) {

    Constraint.apply(this, arguments); // call super constructor.

    this.setExtra(extra);

    if (isArray(opt)) {

        opt = {
            type: opt,
        }
    }

    if (typeof opt === 'string') {

        opt = {
            type: opt,
        }
    }

    opt = Object.assign({}, def, opt);

    if ( ! isArray(opt.type) ) {

        opt.type = [opt.type];
    }

    for (let i = 0, l = opt.type.length ; i < l ; i += 1 ) {

        if (typeof opt.type[i] === 'string') {

            opt.type[i] = opt.type[i].toLowerCase();
        }
        else {

            throw `Type constraint: Each of types have to be string one of: ` + Type.prototype.allowedTypes.map(a => `"${a}"`).join(', ');
        }

        if (Type.prototype.allowedTypes.indexOf(opt.type[i]) === -1) {

            throw `Type constraint: One of types is string but is not one of: ` + Type.prototype.allowedTypes.map(a => `"${a}"`).join(', ');
        }
    }

    this.setOptions(opt);
}

Type.prototype = Object.create(Constraint.prototype);

Type.prototype.constructor = Type;

Type.prototype.INVALID_TYPE_ERROR = 'INVALID_TYPE_ERROR';

Type.prototype.validate = function (value, context, path, extra) {

    const opt = this.getOptions();

    if ( ! Type.prototype.logic(value, opt.type) ) {

        context
            .buildViolation(opt.message)
            .atPath(path)
            .setParameter('{{ type }}', opt.type.join(', '))
            .setCode(Type.prototype.INVALID_TYPE_ERROR)
            .setInvalidValue(value)
            .addViolation()
        ;

        if (extra && extra.stop) {

            // return reject('stop Type');
            return Promise.reject('stop Type');
        }
    }

    return Promise.resolve('resolve Type');
};

Type.prototype.logic = function (value, type) {

    let valid = false;

    let arr = isArray(value);

    let obj = isObject(value);

    let t;

    for (let i = 0, l = type.length ; i < l ; i += 1 ) {

        t = type[i];

        if (t === 'int') {

            t = 'integer';
        }

        if (t === 'bool') {

            t = 'boolean';
        }

        if (t === 'array' && arr && !obj) {

            valid = true;
            break;
        }

        if (t === 'object' && !arr && obj) {

            valid = true;
            break;
        }

        if (t === 'integer' && Number.isInteger(value)) {

            valid = true;
            break;
        }

        if ( ! obj && ! arr && typeof value === t) {

            valid = true;
            break;
        }
    }

    return valid;
}

Type.prototype.allowedTypes = 'undefined object boolean bool number string symbol function integer int array'.split(' ');

module.exports = Type;

/***/ })
/******/ ]);
});