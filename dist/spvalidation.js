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


var isObject = __webpack_require__(2);

function Constraint() {
  if (!(this instanceof Constraint)) {
    throw "It is necessary to use operator 'new' with all constraints";
  }
}

;
var sufix = '_ERROR';
var sufix_length = sufix.length;

Constraint.prototype.errorNames = function () {
  var _this = this;

  if (!Constraint.prototype._errorNames) {
    Constraint.prototype._errorNames = Object.keys(this.constructor.prototype).reduce(function (acc, key) {
      var val = _this.constructor.prototype[key];

      if (typeof val === 'string' && key === key.toUpperCase() && key.substring(key.length - sufix_length) === sufix) {
        acc[key] = key;
      }

      return acc;
    }, {});
  }

  return Constraint.prototype._errorNames;
};

Constraint.prototype.getOptions = function () {
  return this.opt;
};

Constraint.prototype.setOptions = function (opt) {
  this.opt = opt;
  return this;
};

Constraint.prototype.setExtra = function (extra) {
  this.extra = extra;
  return this;
};

Constraint.prototype.getExtra = function () {
  return this.extra;
}; // Constraint.prototype.validate = function (value, context) {}


Constraint.prototype.validate = false; // Constraint.prototype.validateChildren = function (value, context) {}

Constraint.prototype.validateChildren = false;
module.exports = Constraint;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

;
module.exports = isArray;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

;
module.exports = isObject;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var Existence = function Existence() {
  Constraint.apply(this, arguments); // call super constructor.
};

Existence.prototype = Object.create(Constraint.prototype);
Existence.prototype.constructor = Existence;
module.exports = Existence;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Existence = __webpack_require__(3);

var Constraint = __webpack_require__(0);

var All = __webpack_require__(5);

var isArray = __webpack_require__(1);

var each = __webpack_require__(6);

var connectAndSort = function connectAndSort(value, constraints, context, path) {
  var final = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (constraints instanceof Existence) {
    return connectAndSort(value, constraints.getOptions(), context, path, final);
  }

  if (constraints instanceof Constraint) {
    constraints = [constraints];
  }

  if (!isArray(constraints)) {
    if (final) {
      return context.getTriggers();
    }

    return;
  }

  var extra;

  var _loop = function _loop(i, l) {
    if (constraints[i] instanceof Existence) {
      connectAndSort(value, constraints[i].getOptions(), context, path);
    } else if (constraints[i] instanceof All) {
      var combine = path ? function (name) {
        return path + '.' + name;
      } : function (name) {
        return name;
      };
      var allConstraints = constraints[i].getOptions();
      each(value, function (v, name) {
        connectAndSort(v, allConstraints, context, combine(name));
      });
    } else {
      (function (extra) {
        context.addTrigger(extra ? extra.async : 0, function () {
          return constraints[i].validate(value, context, path, extra);
        });
      })(constraints[i].getExtra());

      if (constraints[i].validateChildren) {
        (function (extra) {
          constraints[i].validateChildren(value, context, path, extra);
        })(constraints[i].getExtra());
      }
    }
  };

  for (var i = 0, l = constraints.length; i < l; i += 1) {
    _loop(i, l);
  }

  if (final) {
    return context.getTriggers();
  }
};

module.exports = connectAndSort;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var All = function All(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);
  this.setOptions(opt);
};

All.prototype = Object.create(Constraint.prototype);
All.prototype.constructor = All;
module.exports = All;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(1);

var isObject = __webpack_require__(2);

module.exports = function each(obj, fn, context) {
  var r;

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; ++i) {
      if (fn.call(context, obj[i], i) === false) {
        return;
      }
    }
  } else if (isObject(obj)) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (fn.call(context, obj[i], i) === false) {
          return;
        }
      }
    }
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Existence = __webpack_require__(3);

var Constraint = __webpack_require__(0);

var Required = function Required(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);
  this.setOptions(opt);
};

Required.prototype = Object.create(Existence.prototype);
Required.prototype.constructor = Required;
module.exports = Required;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Existence = __webpack_require__(3);

var Constraint = __webpack_require__(0);

var Optional = function Optional(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);
  this.setOptions(opt);
};

Optional.prototype = Object.create(Existence.prototype);
Optional.prototype.constructor = Optional;
module.exports = Optional;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(2);

var isArray = __webpack_require__(1);

var Constraint = __webpack_require__(0);

var def = {
  message: 'This value should be blank.'
};

var Blank = function Blank(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === 'string') {
    opt = {
      message: opt
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

Blank.prototype = Object.create(Constraint.prototype);
Blank.prototype.constructor = Blank;
Blank.prototype.NOT_BLANK_ERROR = 'NOT_BLANK_ERROR';

Blank.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();
  var blank = Blank.prototype.logic(value);

  if (!blank) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(Blank.prototype.NOT_BLANK_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      return Promise.reject('stop Blank');
    }
  }

  return Promise.resolve('resolve Blank');
};

Blank.prototype.logic = function (value) {
  var notblank = true;

  switch (true) {
    case !value: // covers: false, null, undefined, '', 0, NaN

    case value === '0': // covers: '0'

    case isArray(value) && value.length === 0:
    case isObject(value) && Object.keys(value).length === 0:
      notblank = false;
      break;
  }

  return !notblank;
};

module.exports = Blank;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Context = __webpack_require__(11);

var connectAndSort = __webpack_require__(4);

var delay = __webpack_require__(15); // const log               = require('../log/logn');

/**
 * import validator, { test } from '@stopsopa/validator';
 *
 * @param data
 * @param constraints
 * @param options
 * @returns {string}
 */


var validator = function validator(value, constraints, extra, debug) {
  var context = new Context(value, extra);
  var connected = connectAndSort(value, constraints, context, extra ? extra.path : undefined, true);
  var promise = Promise.resolve();

  while (connected.length) {
    (function (list) {
      promise = promise.then(function () {
        return Promise.all(list.map(function (c) {
          return c();
        }));
      });

      if (debug > 1) {
        var _promise;

        promise = (_promise = promise).then.apply(_promise, _toConsumableArray(delay.then(2500)));
      }

      if (debug > 0) {
        promise = promise.then(function (a) {
          console.log('debug resolved:', JSON.stringify(a));
          return a;
        }, function (a) {
          console.log('debug rejected:', JSON.stringify(a));
          return a;
        });
      }
    })(connected.shift());
  }

  var end = function end() {
    return context.getViolations();
  };

  return promise.then(end, end);
};

validator.Required = __webpack_require__(7);
validator.Optional = __webpack_require__(8);
validator.Collection = __webpack_require__(16);
validator.All = __webpack_require__(5);
validator.Blank = __webpack_require__(9);
validator.Callback = __webpack_require__(18);
validator.Choice = __webpack_require__(19);
validator.Count = __webpack_require__(20);
validator.Email = __webpack_require__(21);
validator.IsFalse = __webpack_require__(22);
validator.IsNull = __webpack_require__(23);
validator.IsTrue = __webpack_require__(24);
validator.Length = __webpack_require__(25);
validator.NotBlank = __webpack_require__(26);
validator.NotNull = __webpack_require__(27);
validator.Regex = __webpack_require__(28);
validator.Type = __webpack_require__(29);
module.exports = validator;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ViolationBuilder = __webpack_require__(12);

var ConstraintViolationList = __webpack_require__(13);

var Context = function Context(rootData) {
  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.violations = [];
  this.rootData = rootData;
  this.extra = extra;
  this.stack = {};
};

Context.prototype.buildViolation = function () {
  var args = Array.prototype.slice.call(arguments);

  if (args.length === 0) {
    throw "new Context(message).buildViolation(message): message not specified";
  }

  if (typeof args[0] !== 'string') {
    throw "new Context(message).buildViolation(message): message arg must be string";
  }

  return new ViolationBuilder(args[0], this);
};

Context.prototype.addViolation = function (path, message, code, invalidValue, extra) {
  var violation = [path, message, code, invalidValue];

  if (typeof extra !== 'undefined') {
    violation.push(extra);
  }

  this.violations.push(violation);
};

Context.prototype.addTrigger = function () {
  var async = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var trigger = arguments.length > 1 ? arguments[1] : undefined;

  if (this.stack[async]) {
    this.stack[async].push(trigger);
  } else {
    this.stack[async] = [trigger];
  }

  return this;
};

Context.prototype.getTriggers = function () {
  var _this = this;

  var list = Object.keys(this.stack).sort().reduce(function (acc, key) {
    _this.stack[key].length && acc.push(_this.stack[key]);
    return acc;
  }, []);
  this.stack = {};
  return list;
};

Context.prototype.getViolations = function () {
  return new ConstraintViolationList(this.violations);
};

Context.prototype.getRoot = function () {
  return this.rootData;
};

Context.prototype.getExtra = function () {
  return this.extra;
};

module.exports = Context;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ViolationBuilder = function ViolationBuilder(message, context) {
  this.parameters = {};
  this.code = undefined;
  this.path = undefined;
  this.plural = false;
  this.invalidValue = undefined;
  this.extra = undefined;
  this.message = message;
  this.context = context;
};

ViolationBuilder.prototype.setParameter = function (name, value) {
  this.parameters[name] = value;
  return this;
};

ViolationBuilder.prototype.setCode = function (code) {
  this.code = code;
  return this;
};

ViolationBuilder.prototype.atPath = function (path) {
  this.path = path;
  return this;
};

ViolationBuilder.prototype.setPlural = function (plural) {
  if (!Number.isInteger(plural) || plural < 0) {
    throw "ViolationBuilder.setPlural(plural) - plural parameter should be integer in range 0-inifinty";
  }

  this.plural = plural;
  return this;
};

ViolationBuilder.prototype.setInvalidValue = function (invalidValue) {
  this.invalidValue = invalidValue;
  return this;
};

ViolationBuilder.prototype.setExtra = function (extra) {
  this.extra = extra;
  return this;
};

ViolationBuilder.prototype.addViolation = function () {
  var _this = this;

  if (this.code === undefined) {
    throw "ViolationBuilder: this.code === undefined, call ViolationBuilder->setCode(code)";
  }

  var message = this.message;

  if (typeof message === 'string' && message.indexOf('|') > -1 && this.plural !== false && this.plural > -1) {
    var split = message.split('|');

    if (split.length > this.plural) {
      message = split[this.plural];
    }
  }

  Object.keys(this.parameters).map(function (key) {
    var cp;

    do {
      cp = message;
      message = message.replace(key, _this.parameters[key]);
    } while (cp !== message);
  });
  this.context.addViolation(this.path, message, this.code, this.invalidValue, this.extra);
  return this;
};

module.exports = ViolationBuilder;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var set = __webpack_require__(14);

var isArray = __webpack_require__(1);
/**
 * https://stackoverflow.com/a/14438954
 */


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function ConstraintViolationList(violations) {
  this.violations = violations;
}

ConstraintViolationList.prototype.getRaw = function () {
  return this.violations.map(function (v) {
    if (v.length > 4) {
      v.pop();
    }

    return v;
  });
};

ConstraintViolationList.prototype.getFlat = function () {
  var all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var key;
  var list = this.violations.reduce(function (acc, v) {
    key = v[0] || '';

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(v);
    return acc;
  }, {});
  return Object.keys(list).reduce(function (acc, key) {
    acc[key] = list[key];
    acc[key].sort(function (aa, bb) {
      var a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var b = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (typeof aa[4] === 'number') {
        a = aa[4];
      } else if (aa[4] && typeof aa[4].order !== 'undefined') {
        a = aa[4].order;
      }

      if (typeof bb[4] === 'number') {
        b = bb[4];
      } else if (bb[4] && typeof bb[4].order !== 'undefined') {
        b = bb[4].order;
      }

      return b - a;
    });
    acc[key] = acc[key].map(function (v) {
      return v[1];
    });

    if (!all) {
      acc[key] = acc[key].shift();
    }

    return acc;
  }, {});
};

ConstraintViolationList.prototype.getTree = function () {
  var all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var raw = this.getFlat(all);
  return Object.keys(raw).reduce(function (acc, key) {
    acc = set(acc, key, raw[key]);
    return acc;
  }, {});
};

ConstraintViolationList.prototype.findByCodes = function (codes) {
  var _this = this;

  if (!isArray(codes)) {
    codes = [codes];
  }

  codes = codes.filter(onlyUnique);
  var tmp = [];

  var _loop = function _loop(i, l) {
    tmp = tmp.concat(_this.violations.filter(function (v) {
      return v[2] === codes[i];
    }));
  };

  for (var i = 0, l = codes.length; i < l; i += 1) {
    _loop(i, l);
  }

  return tmp;
};

ConstraintViolationList.prototype.count = function () {
  return this.violations.length;
};

module.exports = ConstraintViolationList;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(1);

var isObject = __webpack_require__(2);

function set(source, key, value) {
  if (typeof key === 'string') {
    key = key.split('.');
  }

  if (typeof key === 'number') {
    key = key + '';
  }

  if (isObject(key)) {
    key = Object.values(key).map(function (a) {
      return a += '';
    });
  }

  if (typeof key !== 'string' && !key && key !== '0' && key !== '') {
    key = [];
  }

  if (!isArray(key)) {
    key = [key];
  }

  if (key.length) {
    var first = true;
    var ar = isArray(source);

    if (!ar && !isObject(source)) {
      source = {};
    }

    var kt;
    var tmp = source;
    var tmp2 = source;
    var obb, arr;

    while (key.length) {
      kt = key.shift();

      if (first) {
        first = false;

        if (ar && !/^\d+$/.test(kt) && kt !== '') {
          throw "if source is array and key is not integer nor empty string then its not possible to add to array, given key: " + JSON.stringify(kt);
        }
      }

      tmp = tmp2;

      if (key.length) {
        obb = isObject(tmp[kt]);
        arr = isArray(tmp[kt]);

        if (!(obb || arr)) {
          if (key[0] === '') {
            arr || (tmp[kt] = []);
          } else {
            obb || (tmp[kt] = {});
          }
        }

        tmp2 = tmp[kt];
      } else {
        if (isArray(tmp)) {
          if (kt === '') {
            tmp.push(value);
          } else {
            tmp[kt] = value;
          }
        } else {
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

var delay = function delay(time, data) {
  return new Promise(function (resolve) {
    return time ? setTimeout(resolve, time, data) : resolve(data);
  });
};
/**
    return Promise.resolve()
        .then(
            () => delay(3000, 'ok')
            () => delay.reject(3000, 'error')
        )

 */


var reject = function reject(time, data) {
  return new Promise(function (resolve, reject) {
    return time ? setTimeout(reject, time, data) : reject(data);
  });
};
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


var then = function then(time) {
  return [function (data) {
    return delay(time, data);
  }, function (data) {
    return delay.reject(time, data);
  }];
};

delay.reject = reject;
delay.then = then;
module.exports = delay;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayIntersect = __webpack_require__(17);

var isObject = __webpack_require__(2);

var Constraint = __webpack_require__(0);

var Existence = __webpack_require__(3);

var Required = __webpack_require__(7);

var Optional = __webpack_require__(8);

var connectAndSort = __webpack_require__(4);

var isArray = __webpack_require__(1);

var each = __webpack_require__(6);

var def = {
  fields: {},
  allowExtraFields: false,
  allowMissingFields: false,
  extraFieldsMessage: 'This field was not expected.',
  missingFieldsMessage: 'This field is missing.'
};

var Collection = function Collection(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (!isObject(opt) || opt instanceof Constraint) {
    throw "Collection accept only plain object as a first argument";
  }

  if (isObject(opt) && arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0) {
    opt = Object.assign({}, def, {
      fields: opt
    });
  } else {
    opt = Object.assign({}, def, opt);
  }

  if (Object.keys(opt.fields).length === 0) {
    throw "Describe at least one field in \"fields\" parameter";
  }

  opt.fields = Object.keys(opt.fields).reduce(function (acc, field) {
    if (opt.fields[field] instanceof Existence) {
      acc[field] = opt.fields[field];
    } else {
      acc[field] = new Required(opt.fields[field]);
    }

    return acc;
  }, {});
  this.setOptions(opt);
};

Collection.prototype = Object.create(Constraint.prototype);
Collection.prototype.constructor = Collection;
Collection.prototype.MISSING_FIELD_ERROR = 'MISSING_FIELD_ERROR';
Collection.prototype.NO_SUCH_FIELD_ERROR = 'NO_SUCH_FIELD_ERROR';

Collection.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (isObject(value) || isArray(value)) {
    Object.keys(opt.fields).forEach(function (field) {
      if (typeof value[field] === 'undefined') {
        if (!(opt.fields[field] instanceof Optional) && !opt.allowMissingFields) {
          context.buildViolation(opt.missingFieldsMessage).atPath(typeof path === 'undefined' ? field : path + '.' + field).setParameter('{{ field }}', field).setCode(Collection.prototype.MISSING_FIELD_ERROR).setInvalidValue(value).addViolation();
        }
      }
    });

    if (!opt.allowExtraFields) {
      each(value, function (v, field) {
        if (typeof opt.fields[field] === 'undefined') {
          context.buildViolation(opt.extraFieldsMessage).atPath(typeof path === 'undefined' ? field : path + '.' + field).setParameter('{{ field }}', field).setCode(Collection.prototype.NO_SUCH_FIELD_ERROR).setInvalidValue(value).addViolation();
        }
      });
    }
  }

  return Promise.resolve('resolve Collection2');
};

Collection.prototype.validateChildren = function (value, context, path, extra) {
  var opt = this.getOptions();
  var tmp;
  each(value, function (v, name) {
    if (tmp = opt.fields[name]) {
      connectAndSort(value[name], tmp.getOptions(), context, path ? path + '.' + name : name);
    }
  });
};

module.exports = Collection;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(1);

module.exports = function (a, b) {
  if (!isArray(a)) {
    return [];
  }

  if (!isArray(b)) {
    return [];
  }

  return a.reduce(function (acc, val) {
    if (b.indexOf(val) > -1) {
      acc.push(val);
    }

    return acc;
  }, []);
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var Callback = function Callback(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt !== 'function') {
    throw "Callback constraint first arg should be function";
  }

  this.setOptions(opt);
};

Callback.prototype = Object.create(Constraint.prototype);
Callback.prototype.constructor = Callback;

Callback.prototype.validate = function (value, context, path, extra) {
  var callback = this.getOptions();
  return Promise.resolve(callback(value, context, path, extra));
};

module.exports = Callback;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(2);

var isArray = __webpack_require__(1);

var Constraint = __webpack_require__(0);

var def = {
  message: 'The value you selected is not a valid choice.',
  multipleMessage: 'One or more of the given values is invalid.',
  minMessage: 'You must select at least {{ limit }} choice.|You must select at least {{ limit }} choices.',
  maxMessage: 'You must select at most {{ limit }} choice.|You must select at most {{ limit }} choices.',
  multiple: false // choices         : []
  // max,
  // min;

};

var Choice = function Choice(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (isArray(opt)) {
    opt = {
      choices: opt
    };
  }

  opt = Object.assign({}, def, opt);

  if (!isArray(opt.choices) || opt.choices.length === 0) {
    throw "Choice: choices have to be non empty list";
  }

  this.setOptions(opt);
};

Choice.prototype = Object.create(Constraint.prototype);
Choice.prototype.constructor = Choice;
Choice.prototype.NO_SUCH_CHOICE_ERROR = 'NO_SUCH_CHOICE_ERROR';
Choice.prototype.TOO_FEW_ERROR = 'TOO_FEW_ERROR';
Choice.prototype.TOO_MANY_ERROR = 'TOO_MANY_ERROR';

var promise = function promise(extra, f) {
  return extra && extra.stop ? Promise.reject('stop Choice' + f) : Promise.resolve('resolve Choice' + f);
};

Choice.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (value === null) {
    return Promise.resolve('Choice');
  }

  if (opt.multiple) {
    if (isArray(value)) {
      var count = value.length;

      for (var i = 0, l = count; i < l; i += 1) {
        if (opt.choices.indexOf(value[i]) === -1) {
          context.buildViolation(opt.multipleMessage).atPath(path + '.' + i).setParameter('{{ value }}', value[i]).setInvalidValue(value).setCode(Choice.prototype.NO_SUCH_CHOICE_ERROR).setExtra(extra).addViolation();
          return promise(extra, 2);
        }
      }

      if (typeof opt.min !== 'undefined' && count < opt.min) {
        context.buildViolation(opt.minMessage).atPath(path).setParameter('{{ limit }}', opt.min).setPlural(opt.min === 1 ? 0 : 1).setInvalidValue(value).setCode(Choice.prototype.TOO_FEW_ERROR).setExtra(extra).addViolation();
        return promise(extra, 2);
      }

      if (typeof opt.max !== 'undefined' && count > opt.max) {
        context.buildViolation(opt.maxMessage).atPath(path).setParameter('{{ limit }}', opt.max).setPlural(opt.max === 1 ? 0 : 1).setInvalidValue(value).setCode(Choice.prototype.TOO_MANY_ERROR).setExtra(extra).addViolation();
        return promise(extra, 3);
      }
    }
  } else if (opt.choices.indexOf(value) === -1) {
    context.buildViolation(opt.message).atPath(path).setParameter('{{ value }}', value).setInvalidValue(value).setCode(Choice.prototype.NO_SUCH_CHOICE_ERROR).setExtra(extra).addViolation();
    return promise(extra, 4);
  }

  return Promise.resolve('Choice1');
};

module.exports = Choice;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isArray = __webpack_require__(1);

var isObject = __webpack_require__(2);

var Constraint = __webpack_require__(0);

var def = {
  minMessage: 'This collection should contain {{ limit }} element or more.|This collection should contain {{ limit }} elements or more.',
  maxMessage: 'This collection should contain {{ limit }} element or less.|This collection should contain {{ limit }} elements or less.',
  exactMessage: 'This collection should contain exactly {{ limit }} element.|This collection should contain exactly {{ limit }} elements.' // max,
  // min;

};

function Count() {
  var args = Array.prototype.slice.call(arguments);
  Constraint.apply(this, args); // call super constructor.

  if (args.length === 0) {
    throw "Count: options must be given for this constraint";
  }

  var opt = args[0];
  this.setExtra(args[1]);

  if (Number.isInteger(opt)) {
    opt = {
      min: opt,
      max: opt
    };
  }

  if (isObject(opt)) {
    opt = Object.assign({}, def, opt);
  } else {
    throw "Count: Wrong parameter type have been given to this constraint, typeof: " + _typeof(opt);
  }

  if (typeof opt.min === 'undefined' && typeof opt.max === 'undefined') {
    throw "Count: Either option \"min\" or \"max\" must be given for constraint";
  }

  if (typeof opt.min !== 'undefined' && !Number.isInteger(opt.min)) {
    throw "Count: min should be integer";
  }

  if (typeof opt.max !== 'undefined' && !Number.isInteger(opt.max)) {
    throw "Count: max should be integer";
  }

  if (opt.min < 0) {
    throw "Count: min should be greater than 0";
  }

  if (opt.max < 0) {
    throw "Count: max should be greater than 0";
  }

  this.setOptions(opt);
}

Count.prototype = Object.create(Constraint.prototype);
Count.prototype.constructor = Count;
Count.prototype.TOO_FEW_ERROR = 'TOO_FEW_ERROR';
Count.prototype.TOO_MANY_ERROR = 'TOO_MANY_ERROR';

Count.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();
  var count = false;

  if (isArray(value)) {
    count = value.length;
  }

  if (count === false && isObject(value)) {
    count = Object.keys(value).length;
  }

  if (count !== false) {
    if (typeof opt.max !== 'undefined' && count > opt.max) {
      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage).atPath(path).setParameter('{{ count }}', count).setParameter('{{ limit }}', opt.max).setInvalidValue(value).setPlural(opt.max === 1 ? 0 : 1).setCode(Count.prototype.TOO_MANY_ERROR).addViolation();
      return extra && extra.stop ? Promise.reject('stop Count') : Promise.resolve('resolve Count');
    }

    if (typeof opt.min !== 'undefined' && count < opt.min) {
      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage).atPath(path).setParameter('{{ count }}', count).setParameter('{{ limit }}', opt.min).setInvalidValue(value).setPlural(opt.min === 1 ? 0 : 1).setCode(Count.prototype.TOO_FEW_ERROR).addViolation();
      return extra && extra.stop ? Promise.reject('stop Count') : Promise.resolve('resolve Count');
    }
  }

  return Promise.resolve('Count');
};

module.exports = Count;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var def = {
  message: 'This value is not a valid email address.'
};

var Email = function Email(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === 'string') {
    opt = {
      message: opt
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

Email.prototype = Object.create(Constraint.prototype);
Email.prototype.constructor = Email;
Email.prototype.INVALID_EMAIL_ERROR = 'INVALID_EMAIL_ERROR';

Email.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (!Email.prototype.logic(value)) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(Email.prototype.INVALID_EMAIL_ERROR).setInvalidValue(value).addViolation();

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
};

module.exports = Email;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var def = {
  message: 'This value should be false.'
};

var IsFalse = function IsFalse(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === 'string') {
    opt = {
      message: opt
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

IsFalse.prototype = Object.create(Constraint.prototype);
IsFalse.prototype.constructor = IsFalse;
IsFalse.prototype.NOT_FALSE_ERROR = 'NOT_FALSE_ERROR';

IsFalse.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (value !== false) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(IsFalse.prototype.NOT_FALSE_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      return Promise.reject('stop IsFalse');
    }
  }

  return Promise.resolve('resolve IsFalse');
};

module.exports = IsFalse;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var def = {
  message: 'This value should be null.'
};

var IsNull = function IsNull(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === 'string') {
    opt = {
      message: opt
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

IsNull.prototype = Object.create(Constraint.prototype);
IsNull.prototype.constructor = IsNull;
IsNull.prototype.NOT_NULL_ERROR = 'NOT_NULL_ERROR';

IsNull.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (value !== null) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(IsNull.prototype.NOT_NULL_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      return Promise.reject('stop IsNull');
    }
  }

  return Promise.resolve('resolve IsNull');
};

module.exports = IsNull;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var def = {
  message: 'This value should be true.'
};

var IsTrue = function IsTrue(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === 'string') {
    opt = {
      message: opt
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

IsTrue.prototype = Object.create(Constraint.prototype);
IsTrue.prototype.constructor = IsTrue;
IsTrue.prototype.NOT_TRUE_ERROR = 'NOT_TRUE_ERROR';

IsTrue.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (value !== true) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(IsTrue.prototype.NOT_TRUE_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      return Promise.reject('stop IsTrue');
    }
  }

  return Promise.resolve('resolve IsTrue');
};

module.exports = IsTrue;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isObject = __webpack_require__(2);

var Constraint = __webpack_require__(0);

var def = {
  maxMessage: 'This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.',
  minMessage: 'This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.',
  exactMessage: 'This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.' // max,
  // min;

};

function Length() {
  var args = Array.prototype.slice.call(arguments);
  Constraint.apply(this, args); // call super constructor.

  if (args.length === 0) {
    throw "Length: options must be given for this constraint";
  }

  var opt = args[0];
  this.setExtra(args[1]);

  if (Number.isInteger(opt)) {
    opt = {
      min: opt,
      max: opt
    };
  }

  if (isObject(opt)) {
    opt = Object.assign({}, def, opt);
  } else {
    throw "Length: Wrong parameter type have been given to this constraint, typeof: " + _typeof(opt);
  }

  if (typeof opt.min === 'undefined' && typeof opt.max === 'undefined') {
    throw "Length: Either option \"min\" or \"max\" must be given for constraint";
  }

  this.setOptions(opt);
}

Length.prototype = Object.create(Constraint.prototype);
Length.prototype.constructor = Length;
Length.prototype.TOO_SHORT_ERROR = 'TOO_SHORT_ERROR';
Length.prototype.TOO_LONG_ERROR = 'TOO_LONG_ERROR';

Length.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (typeof value === 'string') {
    var length = value.length;

    if (typeof opt.max !== 'undefined' && length > opt.max) {
      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage).atPath(path).setPlural(opt.max === 1 ? 0 : 1).setParameter('{{ value }}', value).setParameter('{{ limit }}', opt.max).setInvalidValue(value).setCode(Length.prototype.TOO_LONG_ERROR).setExtra(extra).addViolation();
      return extra && extra.stop ? Promise.reject('stop Length') : Promise.resolve('resolve Length');
    }

    if (typeof opt.min !== 'undefined' && length < opt.min) {
      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage).atPath(path).setPlural(opt.min === 1 ? 0 : 1).setParameter('{{ value }}', value).setParameter('{{ limit }}', opt.min).setInvalidValue(value).setCode(Length.prototype.TOO_SHORT_ERROR).setExtra(extra).addViolation();
      return extra && extra.stop ? Promise.reject('stop Length') : Promise.resolve('resolve Length');
    }
  }

  return Promise.resolve('Length');
};

module.exports = Length;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var Blank = __webpack_require__(9);

var def = {
  message: 'This value should not be blank.'
};

var NotBlank = function NotBlank(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === 'string') {
    opt = {
      message: opt
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

NotBlank.prototype = Object.create(Constraint.prototype);
NotBlank.prototype.constructor = NotBlank;
NotBlank.prototype.IS_BLANK_ERROR = 'IS_BLANK_ERROR';

NotBlank.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();
  var blank = Blank.prototype.logic(value);

  if (blank) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(NotBlank.prototype.IS_BLANK_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      return Promise.reject('stop NotBlank');
    }
  }

  return Promise.resolve('resolve NotBlank');
};

module.exports = NotBlank;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var def = {
  message: 'This value should be true.'
};

var NotNull = function NotNull(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (typeof opt === 'string') {
    opt = {
      message: opt
    };
  }

  this.setOptions(Object.assign({}, def, opt));
};

NotNull.prototype = Object.create(Constraint.prototype);
NotNull.prototype.constructor = NotNull;
NotNull.prototype.IS_NULL_ERROR = 'IS_NULL_ERROR';

NotNull.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (value === null) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(NotNull.prototype.IS_NULL_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      // return reject('stop Type');
      return Promise.reject('stop NotNull');
    }
  }

  return Promise.resolve('resolve NotNull');
};

module.exports = NotNull;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Constraint = __webpack_require__(0);

var isObject = __webpack_require__(2);

var def = {
  message: 'This value is not valid.',
  match: true
};

var Regex = function Regex(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (Regex.prototype.isRegex(opt)) {
    opt = {
      pattern: opt
    };
  }

  if (!isObject(opt)) {
    throw "Regex: first argument must be regex or object";
  }

  if (!Regex.prototype.isRegex(opt.pattern)) {
    throw "Regex: 'pattern' is not specified";
  }

  this.setOptions(Object.assign({}, def, opt));
};

Regex.prototype = Object.create(Constraint.prototype);
Regex.prototype.constructor = Regex;
Regex.prototype.REGEX_FAILED_ERROR = 'REGEX_FAILED_ERROR';

Regex.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (!Regex.prototype.logic(value, opt.pattern, opt.match)) {
    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))
    .setCode(Regex.prototype.REGEX_FAILED_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      return Promise.reject('stop Regex');
    }
  }

  return Promise.resolve('resolve Regex');
};

Regex.prototype.isRegex = function (reg) {
  return Object.prototype.toString.call(reg) === "[object RegExp]";
};

Regex.prototype.logic = function (value, regex, match) {
  value += ''; // to make it works on value given by any type, It is good idea to use Type constraint before Regex

  var ret = regex.test(value);
  return match ? ret : !ret;
};

module.exports = Regex;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isObject = __webpack_require__(2);

var isArray = __webpack_require__(1);

var Constraint = __webpack_require__(0);

var def = {
  message: "This value should be of type '{{ type }}'."
};

var Type = function Type(opt, extra) {
  Constraint.apply(this, arguments); // call super constructor.

  this.setExtra(extra);

  if (isArray(opt)) {
    opt = {
      type: opt
    };
  }

  if (typeof opt === 'string') {
    opt = {
      type: opt
    };
  }

  opt = Object.assign({}, def, opt);

  if (!isArray(opt.type)) {
    opt.type = [opt.type];
  }

  for (var i = 0, l = opt.type.length; i < l; i += 1) {
    if (typeof opt.type[i] === 'string') {
      opt.type[i] = opt.type[i].toLowerCase();
    } else {
      throw "Type constraint: Each of types have to be string and one of: " + Type.prototype.allowedTypes.map(function (a) {
        return "\"".concat(a, "\"");
      }).join(', ');
    }

    if (Type.prototype.allowedTypes.indexOf(opt.type[i]) === -1) {
      throw "Type constraint: One of types is string but is not one of: " + Type.prototype.allowedTypes.map(function (a) {
        return "\"".concat(a, "\"");
      }).join(', ');
    }
  }

  this.setOptions(opt);
};

Type.prototype = Object.create(Constraint.prototype);
Type.prototype.constructor = Type;
Type.prototype.INVALID_TYPE_ERROR = 'INVALID_TYPE_ERROR';

Type.prototype.validate = function (value, context, path, extra) {
  var opt = this.getOptions();

  if (!Type.prototype.logic(value, opt.type)) {
    context.buildViolation(opt.message).atPath(path).setParameter('{{ type }}', opt.type.join(', ')).setCode(Type.prototype.INVALID_TYPE_ERROR).setInvalidValue(value).addViolation();

    if (extra && extra.stop) {
      // return reject('stop Type');
      return Promise.reject('stop Type');
    }
  }

  return Promise.resolve('resolve Type');
};

Type.prototype.logic = function (value, type) {
  var valid = false;
  var arr = isArray(value);
  var obj = isObject(value);
  var t;

  for (var i = 0, l = type.length; i < l; i += 1) {
    t = type[i];

    if (t === 'int') {
      t = 'integer';
    }

    if (t === 'str') {
      t = 'string';
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

    if (!obj && !arr && _typeof(value) === t) {
      valid = true;
      break;
    }
  }

  return valid;
};

Type.prototype.allowedTypes = 'undefined object boolean bool number str string symbol function integer int array'.split(' ');
module.exports = Type;

/***/ })
/******/ ]);
});