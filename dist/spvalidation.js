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
/******/ 	return __webpack_require__(__webpack_require__.s = "./validator/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./validator/constraints/All.js":
/*!**************************************!*\
  !*** ./validator/constraints/All.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar All = function All(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n  this.setOptions(opt);\n};\n\nAll.prototype = Object.create(Constraint.prototype);\nAll.prototype.constructor = All;\nmodule.exports = All;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/All.js?");

/***/ }),

/***/ "./validator/constraints/Blank.js":
/*!****************************************!*\
  !*** ./validator/constraints/Blank.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isObject = __webpack_require__(/*! ../utils/isObject */ \"./validator/utils/isObject.js\");\n\nvar isArray = __webpack_require__(/*! ../utils/isArray */ \"./validator/utils/isArray.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  message: 'This value should be blank.'\n};\n\nvar Blank = function Blank(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt === 'string') {\n    opt = {\n      message: opt\n    };\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nBlank.prototype = Object.create(Constraint.prototype);\nBlank.prototype.constructor = Blank;\nBlank.prototype.NOT_BLANK_ERROR = 'NOT_BLANK_ERROR';\n\nBlank.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n  var blank = Blank.prototype.logic(value);\n\n  if (!blank) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(Blank.prototype.NOT_BLANK_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      return Promise.reject('stop Blank');\n    }\n  }\n\n  return Promise.resolve('resolve Blank');\n};\n\nBlank.prototype.logic = function (value) {\n  var notblank = true;\n\n  switch (true) {\n    case !value: // covers: false, null, undefined, '', 0, NaN\n\n    case value === '0': // covers: '0'\n\n    case isArray(value) && value.length === 0:\n    case isObject(value) && Object.keys(value).length === 0:\n      notblank = false;\n      break;\n  }\n\n  return !notblank;\n};\n\nmodule.exports = Blank;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Blank.js?");

/***/ }),

/***/ "./validator/constraints/Callback.js":
/*!*******************************************!*\
  !*** ./validator/constraints/Callback.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar Callback = function Callback(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt !== 'function') {\n    throw \"Callback constraint first arg should be function\";\n  }\n\n  this.setOptions(opt);\n};\n\nCallback.prototype = Object.create(Constraint.prototype);\nCallback.prototype.constructor = Callback;\n\nCallback.prototype.validate = function (value, context, path, extra) {\n  var callback = this.getOptions();\n  return new Promise(function (resolve, reject) {\n    var result = callback(value, context, path, extra);\n\n    if (!result || typeof result.then !== 'function') {\n      result = Promise.resolve();\n    }\n\n    result.then(resolve, reject);\n  });\n};\n\nmodule.exports = Callback;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Callback.js?");

/***/ }),

/***/ "./validator/constraints/Collection.js":
/*!*********************************************!*\
  !*** ./validator/constraints/Collection.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayIntersect = __webpack_require__(/*! ../utils/arrayIntersect */ \"./validator/utils/arrayIntersect.js\");\n\nvar isObject = __webpack_require__(/*! ../utils/isObject */ \"./validator/utils/isObject.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar Existence = __webpack_require__(/*! ../prototypes/Existence */ \"./validator/prototypes/Existence.js\");\n\nvar Required = __webpack_require__(/*! ../constraints/Required */ \"./validator/constraints/Required.js\");\n\nvar Optional = __webpack_require__(/*! ../constraints/Optional */ \"./validator/constraints/Optional.js\");\n\nvar connectAndSort = __webpack_require__(/*! ../logic/connectAndSort */ \"./validator/logic/connectAndSort.js\");\n\nvar isArray = __webpack_require__(/*! ../utils/isArray */ \"./validator/utils/isArray.js\");\n\nvar each = __webpack_require__(/*! ../utils/each */ \"./validator/utils/each.js\");\n\nvar def = {\n  fields: {},\n  allowExtraFields: false,\n  allowMissingFields: false,\n  extraFieldsMessage: 'This field was not expected.',\n  missingFieldsMessage: 'This field is missing.'\n};\n\nvar Collection = function Collection(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (!isObject(opt) || opt instanceof Constraint) {\n    throw \"Collection accept only plain object as a first argument\";\n  }\n\n  if (isObject(opt) && arrayIntersect(Object.keys(opt), Object.keys(def)).length === 0) {\n    opt = Object.assign({}, def, {\n      fields: opt\n    });\n  } else {\n    opt = Object.assign({}, def, opt);\n  }\n\n  if (Object.keys(opt.fields).length === 0) {\n    throw \"Describe at least one field in \\\"fields\\\" parameter\";\n  }\n\n  opt.fields = Object.keys(opt.fields).reduce(function (acc, field) {\n    if (opt.fields[field] instanceof Existence) {\n      acc[field] = opt.fields[field];\n    } else {\n      acc[field] = new Required(opt.fields[field]);\n    }\n\n    return acc;\n  }, {});\n  this.setOptions(opt);\n};\n\nCollection.prototype = Object.create(Constraint.prototype);\nCollection.prototype.constructor = Collection;\nCollection.prototype.MISSING_FIELD_ERROR = 'MISSING_FIELD_ERROR';\nCollection.prototype.NO_SUCH_FIELD_ERROR = 'NO_SUCH_FIELD_ERROR';\n\nCollection.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (isObject(value) || isArray(value)) {\n    Object.keys(opt.fields).forEach(function (field) {\n      if (typeof value[field] === 'undefined') {\n        if (!(opt.fields[field] instanceof Optional) && !opt.allowMissingFields) {\n          context.buildViolation(opt.missingFieldsMessage).atPath(typeof path === 'undefined' ? field : path + '.' + field).setParameter('{{ field }}', field).setCode(Collection.prototype.MISSING_FIELD_ERROR).setInvalidValue(value).addViolation();\n        }\n      }\n    });\n\n    if (!opt.allowExtraFields) {\n      each(value, function (v, field) {\n        if (typeof opt.fields[field] === 'undefined') {\n          context.buildViolation(opt.extraFieldsMessage).atPath(typeof path === 'undefined' ? field : path + '.' + field).setParameter('{{ field }}', field).setCode(Collection.prototype.NO_SUCH_FIELD_ERROR).setInvalidValue(value).addViolation();\n        }\n      });\n    }\n  }\n\n  return Promise.resolve('resolve Collection2');\n};\n\nCollection.prototype.validateChildren = function (value, context, path, extra) {\n  var opt = this.getOptions();\n  var tmp;\n  each(value, function (v, name) {\n    if (tmp = opt.fields[name]) {\n      connectAndSort(value[name], tmp.getOptions(), context, typeof path === 'undefined' ? name : path + '.' + name);\n    }\n  });\n};\n\nmodule.exports = Collection;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Collection.js?");

/***/ }),

/***/ "./validator/constraints/Count.js":
/*!****************************************!*\
  !*** ./validator/constraints/Count.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nvar isArray = __webpack_require__(/*! ../utils/isArray */ \"./validator/utils/isArray.js\");\n\nvar isObject = __webpack_require__(/*! ../utils/isObject */ \"./validator/utils/isObject.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  minMessage: 'This collection should contain {{ limit }} element or more.|This collection should contain {{ limit }} elements or more.',\n  maxMessage: 'This collection should contain {{ limit }} element or less.|This collection should contain {{ limit }} elements or less.',\n  exactMessage: 'This collection should contain exactly {{ limit }} element.|This collection should contain exactly {{ limit }} elements.' // max,\n  // min;\n\n};\n\nfunction Count() {\n  var args = Array.prototype.slice.call(arguments);\n  Constraint.apply(this, args); // call super constructor.\n\n  if (args.length === 0) {\n    throw \"Count: options must be given for this constraint\";\n  }\n\n  var opt = args[0];\n  this.setExtra(args[1]);\n\n  if (Number.isInteger(opt)) {\n    opt = {\n      min: opt,\n      max: opt\n    };\n  }\n\n  if (isObject(opt)) {\n    opt = Object.assign({}, def, opt);\n  } else {\n    throw \"Count: Wrong parameter type have been given to this constraint, typeof: \" + _typeof(opt);\n  }\n\n  if (typeof opt.min === 'undefined' && typeof opt.max === 'undefined') {\n    throw \"Count: Either option \\\"min\\\" or \\\"max\\\" must be given for constraint\";\n  }\n\n  if (typeof opt.min !== 'undefined' && !Number.isInteger(opt.min)) {\n    throw \"Count: min should be integer\";\n  }\n\n  if (typeof opt.max !== 'undefined' && !Number.isInteger(opt.max)) {\n    throw \"Count: max should be integer\";\n  }\n\n  if (opt.min < 0) {\n    throw \"Count: min should be greater than 0\";\n  }\n\n  if (opt.max < 0) {\n    throw \"Count: max should be greater than 0\";\n  }\n\n  this.setOptions(opt);\n}\n\nCount.prototype = Object.create(Constraint.prototype);\nCount.prototype.constructor = Count;\nCount.prototype.TOO_FEW_ERROR = 'TOO_FEW_ERROR';\nCount.prototype.TOO_MANY_ERROR = 'TOO_MANY_ERROR';\n\nCount.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n  var count = false;\n\n  if (isArray(value)) {\n    count = value.length;\n  }\n\n  if (count === false && isObject(value)) {\n    count = Object.keys(value).length;\n  }\n\n  if (count !== false) {\n    if (typeof opt.max !== 'undefined' && count > opt.max) {\n      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage).atPath(path).setParameter('{{ count }}', count).setParameter('{{ limit }}', opt.max).setInvalidValue(value).setPlural(opt.max === 1 ? 0 : 1).setCode(Count.prototype.TOO_MANY_ERROR).addViolation();\n      return extra.stop ? Promise.reject('stop Count') : Promise.resolve('resolve Count');\n    }\n\n    if (typeof opt.min !== 'undefined' && count < opt.min) {\n      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage).atPath(path).setParameter('{{ count }}', count).setParameter('{{ limit }}', opt.min).setInvalidValue(value).setPlural(opt.min === 1 ? 0 : 1).setCode(Count.prototype.TOO_FEW_ERROR).addViolation();\n      return extra.stop ? Promise.reject('stop Count') : Promise.resolve('resolve Count');\n    }\n  }\n\n  return Promise.resolve('Count');\n};\n\nmodule.exports = Count;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Count.js?");

/***/ }),

/***/ "./validator/constraints/Email.js":
/*!****************************************!*\
  !*** ./validator/constraints/Email.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  message: 'This value is not a valid email address.'\n};\n\nvar Email = function Email(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt === 'string') {\n    opt = {\n      message: opt\n    };\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nEmail.prototype = Object.create(Constraint.prototype);\nEmail.prototype.constructor = Email;\nEmail.prototype.INVALID_EMAIL_ERROR = 'INVALID_EMAIL_ERROR';\n\nEmail.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (!Email.prototype.logic(value)) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(Email.prototype.INVALID_EMAIL_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      return Promise.reject('stop Email');\n    }\n  }\n\n  return Promise.resolve('resolve Email');\n};\n\nEmail.prototype.logic = function (email) {\n  if (typeof email === 'string') {\n    return /^.+\\@\\S+\\.\\S+$/.test(email);\n  }\n\n  return false;\n};\n\nmodule.exports = Email;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Email.js?");

/***/ }),

/***/ "./validator/constraints/IsFalse.js":
/*!******************************************!*\
  !*** ./validator/constraints/IsFalse.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  message: 'This value should be false.'\n};\n\nvar IsFalse = function IsFalse(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt === 'string') {\n    opt = {\n      message: opt\n    };\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nIsFalse.prototype = Object.create(Constraint.prototype);\nIsFalse.prototype.constructor = IsFalse;\nIsFalse.prototype.NOT_FALSE_ERROR = 'NOT_FALSE_ERROR';\n\nIsFalse.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (value !== false) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(IsFalse.prototype.NOT_FALSE_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      return Promise.reject('stop IsFalse');\n    }\n  }\n\n  return Promise.resolve('resolve IsFalse');\n};\n\nmodule.exports = IsFalse;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/IsFalse.js?");

/***/ }),

/***/ "./validator/constraints/IsNull.js":
/*!*****************************************!*\
  !*** ./validator/constraints/IsNull.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  message: 'This value should be null.'\n};\n\nvar IsNull = function IsNull(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt === 'string') {\n    opt = {\n      message: opt\n    };\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nIsNull.prototype = Object.create(Constraint.prototype);\nIsNull.prototype.constructor = IsNull;\nIsNull.prototype.NOT_NULL_ERROR = 'NOT_NULL_ERROR';\n\nIsNull.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (value !== null) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(IsNull.prototype.NOT_NULL_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      return Promise.reject('stop IsNull');\n    }\n  }\n\n  return Promise.resolve('resolve IsNull');\n};\n\nmodule.exports = IsNull;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/IsNull.js?");

/***/ }),

/***/ "./validator/constraints/IsTrue.js":
/*!*****************************************!*\
  !*** ./validator/constraints/IsTrue.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  message: 'This value should be true.'\n};\n\nvar IsTrue = function IsTrue(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt === 'string') {\n    opt = {\n      message: opt\n    };\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nIsTrue.prototype = Object.create(Constraint.prototype);\nIsTrue.prototype.constructor = IsTrue;\nIsTrue.prototype.NOT_TRUE_ERROR = 'NOT_TRUE_ERROR';\n\nIsTrue.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (value !== true) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(IsTrue.prototype.NOT_TRUE_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      return Promise.reject('stop IsTrue');\n    }\n  }\n\n  return Promise.resolve('resolve IsTrue');\n};\n\nmodule.exports = IsTrue;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/IsTrue.js?");

/***/ }),

/***/ "./validator/constraints/Length.js":
/*!*****************************************!*\
  !*** ./validator/constraints/Length.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nvar isObject = __webpack_require__(/*! ../utils/isObject */ \"./validator/utils/isObject.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  maxMessage: 'This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.',\n  minMessage: 'This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.',\n  exactMessage: 'This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.' // max,\n  // min;\n\n};\n\nfunction Length() {\n  var args = Array.prototype.slice.call(arguments);\n  Constraint.apply(this, args); // call super constructor.\n\n  if (args.length === 0) {\n    throw \"Length: options must be given for this constraint\";\n  }\n\n  var opt = args[0];\n  this.setExtra(args[1]);\n\n  if (Number.isInteger(opt)) {\n    opt = {\n      min: opt,\n      max: opt\n    };\n  }\n\n  if (isObject(opt)) {\n    opt = Object.assign({}, def, opt);\n  } else {\n    throw \"Length: Wrong parameter type have been given to this constraint, typeof: \" + _typeof(opt);\n  }\n\n  if (typeof opt.min === 'undefined' && typeof opt.max === 'undefined') {\n    throw \"Length: Either option \\\"min\\\" or \\\"max\\\" must be given for constraint\";\n  }\n\n  this.setOptions(opt);\n}\n\nLength.prototype = Object.create(Constraint.prototype);\nLength.prototype.constructor = Length;\nLength.prototype.TOO_SHORT_ERROR = 'TOO_SHORT_ERROR';\nLength.prototype.TOO_LONG_ERROR = 'TOO_LONG_ERROR';\n\nLength.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (value !== null && value !== '') {\n    var length = (value || '').length;\n\n    if (typeof opt.max !== 'undefined' && length > opt.max) {\n      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.maxMessage).atPath(path).setPlural(opt.max === 1 ? 0 : 1).setParameter('{{ value }}', value).setParameter('{{ limit }}', opt.max).setInvalidValue(value).setCode(Length.prototype.TOO_LONG_ERROR).addViolation();\n      return extra.stop ? Promise.reject('stop Length') : Promise.resolve('resolve Length');\n    }\n\n    if (typeof opt.min !== 'undefined' && length < opt.min) {\n      context.buildViolation(opt.min === opt.max ? opt.exactMessage : opt.minMessage).atPath(path).setPlural(opt.min === 1 ? 0 : 1).setParameter('{{ value }}', value).setParameter('{{ limit }}', opt.min).setInvalidValue(value).setCode(Length.prototype.TOO_SHORT_ERROR).addViolation();\n      return extra.stop ? Promise.reject('stop Length') : Promise.resolve('resolve Length');\n    }\n  }\n\n  return Promise.resolve('Length');\n};\n\nmodule.exports = Length;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Length.js?");

/***/ }),

/***/ "./validator/constraints/NotBlank.js":
/*!*******************************************!*\
  !*** ./validator/constraints/NotBlank.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar Blank = __webpack_require__(/*! ./Blank */ \"./validator/constraints/Blank.js\");\n\nvar def = {\n  message: 'This value should not be blank.'\n};\n\nvar NotBlank = function NotBlank(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt === 'string') {\n    opt = {\n      message: opt\n    };\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nNotBlank.prototype = Object.create(Constraint.prototype);\nNotBlank.prototype.constructor = NotBlank;\nNotBlank.prototype.IS_BLANK_ERROR = 'IS_BLANK_ERROR';\n\nNotBlank.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n  var blank = Blank.prototype.logic(value);\n\n  if (blank) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(NotBlank.prototype.IS_BLANK_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      return Promise.reject('stop NotBlank');\n    }\n  }\n\n  return Promise.resolve('resolve NotBlank');\n};\n\nmodule.exports = NotBlank;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/NotBlank.js?");

/***/ }),

/***/ "./validator/constraints/NotNull.js":
/*!******************************************!*\
  !*** ./validator/constraints/NotNull.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  message: 'his value should be true.'\n};\n\nvar NotNull = function NotNull(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (typeof opt === 'string') {\n    opt = {\n      message: opt\n    };\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nNotNull.prototype = Object.create(Constraint.prototype);\nNotNull.prototype.constructor = NotNull;\nNotNull.prototype.IS_NULL_ERROR = 'IS_NULL_ERROR';\n\nNotNull.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (value !== true) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(NotNull.prototype.IS_NULL_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      // return reject('stop Type');\n      return Promise.reject('stop NotNull');\n    }\n  }\n\n  return Promise.resolve('resolve NotNull');\n};\n\nmodule.exports = NotNull;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/NotNull.js?");

/***/ }),

/***/ "./validator/constraints/Optional.js":
/*!*******************************************!*\
  !*** ./validator/constraints/Optional.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Existence = __webpack_require__(/*! ../prototypes/Existence */ \"./validator/prototypes/Existence.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar Optional = function Optional(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n  this.setOptions(opt);\n};\n\nOptional.prototype = Object.create(Existence.prototype);\nOptional.prototype.constructor = Optional;\nmodule.exports = Optional;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Optional.js?");

/***/ }),

/***/ "./validator/constraints/Regex.js":
/*!****************************************!*\
  !*** ./validator/constraints/Regex.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar isObject = __webpack_require__(/*! ../utils/isObject */ \"./validator/utils/isObject.js\");\n\nvar def = {\n  message: 'This value is not valid.',\n  match: true\n};\n\nvar Regex = function Regex(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (Regex.prototype.isRegex(opt)) {\n    opt = {\n      pattern: opt\n    };\n  }\n\n  if (!isObject(opt)) {\n    throw \"Regex: first argument must be regex or object\";\n  }\n\n  if (!Regex.prototype.isRegex(opt.pattern)) {\n    throw \"Regex: 'pattern' is not specified\";\n  }\n\n  this.setOptions(Object.assign({}, def, opt));\n};\n\nRegex.prototype = Object.create(Constraint.prototype);\nRegex.prototype.constructor = Regex;\nRegex.prototype.REGEX_FAILED_ERROR = 'REGEX_FAILED_ERROR';\n\nRegex.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (!Regex.prototype.logic(value, opt.pattern, opt.match)) {\n    context.buildViolation(opt.message).atPath(path) // .setParameter('{{ value }}', $this->formatValue($value))\n    .setCode(Regex.prototype.REGEX_FAILED_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      return Promise.reject('stop Regex');\n    }\n  }\n\n  return Promise.resolve('resolve Regex');\n};\n\nRegex.prototype.isRegex = function (reg) {\n  return Object.prototype.toString.call(reg) === \"[object RegExp]\";\n};\n\nRegex.prototype.logic = function (value, regex, match) {\n  if (typeof value === 'string') {\n    var ret = regex.test(value);\n    return match ? ret : !ret;\n  }\n\n  return false;\n};\n\nmodule.exports = Regex;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Regex.js?");

/***/ }),

/***/ "./validator/constraints/Required.js":
/*!*******************************************!*\
  !*** ./validator/constraints/Required.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Existence = __webpack_require__(/*! ../prototypes/Existence */ \"./validator/prototypes/Existence.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar Required = function Required(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n  this.setOptions(opt);\n};\n\nRequired.prototype = Object.create(Existence.prototype);\nRequired.prototype.constructor = Required;\nmodule.exports = Required;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Required.js?");

/***/ }),

/***/ "./validator/constraints/Type.js":
/*!***************************************!*\
  !*** ./validator/constraints/Type.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nvar isObject = __webpack_require__(/*! ../utils/isObject */ \"./validator/utils/isObject.js\");\n\nvar isArray = __webpack_require__(/*! ../utils/isArray */ \"./validator/utils/isArray.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar def = {\n  message: \"This value should be of type '{{ type }}'.\"\n};\n\nvar Type = function Type(opt, extra) {\n  Constraint.apply(this, arguments); // call super constructor.\n\n  this.setExtra(extra);\n\n  if (isArray(opt)) {\n    opt = {\n      type: opt\n    };\n  }\n\n  if (typeof opt === 'string') {\n    opt = {\n      type: opt\n    };\n  }\n\n  opt = Object.assign({}, def, opt);\n\n  if (!isArray(opt.type)) {\n    opt.type = [opt.type];\n  }\n\n  for (var i = 0, l = opt.type.length; i < l; i += 1) {\n    if (typeof opt.type[i] === 'string') {\n      opt.type[i] = opt.type[i].toLowerCase();\n    } else {\n      throw \"Type constraint: Each of types have to be string one of: \" + Type.prototype.allowedTypes.map(function (a) {\n        return \"\\\"\".concat(a, \"\\\"\");\n      }).join(', ');\n    }\n\n    if (Type.prototype.allowedTypes.indexOf(opt.type[i]) === -1) {\n      throw \"Type constraint: One of types is string but is not one of: \" + Type.prototype.allowedTypes.map(function (a) {\n        return \"\\\"\".concat(a, \"\\\"\");\n      }).join(', ');\n    }\n  }\n\n  this.setOptions(opt);\n};\n\nType.prototype = Object.create(Constraint.prototype);\nType.prototype.constructor = Type;\nType.prototype.INVALID_TYPE_ERROR = 'INVALID_TYPE_ERROR';\n\nType.prototype.validate = function (value, context, path, extra) {\n  var opt = this.getOptions();\n\n  if (!Type.prototype.logic(value, opt.type)) {\n    context.buildViolation(opt.message).atPath(path).setParameter('{{ type }}', opt.type.join(', ')).setCode(Type.prototype.INVALID_TYPE_ERROR).setInvalidValue(value).addViolation();\n\n    if (extra.stop) {\n      // return reject('stop Type');\n      return Promise.reject('stop Type');\n    }\n  }\n\n  return Promise.resolve('resolve Type');\n};\n\nType.prototype.logic = function (value, type) {\n  var valid = false;\n  var arr = isArray(value);\n  var obj = isObject(value);\n\n  for (var i = 0, l = type.length; i < l; i += 1) {\n    if (type[i] === 'array' && arr && !obj) {\n      valid = true;\n      break;\n    }\n\n    if (type[i] === 'object' && !arr && obj) {\n      valid = true;\n      break;\n    }\n\n    if (type[i] === 'integer' && Number.isInteger(value)) {\n      valid = true;\n      break;\n    }\n\n    if (!obj && !arr && _typeof(value) === type[i]) {\n      valid = true;\n      break;\n    }\n  }\n\n  return valid;\n};\n\nType.prototype.allowedTypes = 'undefined object boolean number string symbol function integer array'.split(' ');\nmodule.exports = Type;\n\n//# sourceURL=webpack://spvalidation/./validator/constraints/Type.js?");

/***/ }),

/***/ "./validator/index.js":
/*!****************************!*\
  !*** ./validator/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Context = __webpack_require__(/*! ./logic/Context */ \"./validator/logic/Context.js\");\n\nvar connectAndSort = __webpack_require__(/*! ./logic/connectAndSort */ \"./validator/logic/connectAndSort.js\"); // const delay             = require('./utils/delay');\n// const log               = require('../log/logn');\n\n/**\n * import validator, { test } from '@stopsopa/validator';\n *\n * @param data\n * @param constraints\n * @param options\n * @returns {string}\n */\n\n\nvar validator = function validator(value, constraints, extra) {\n  var context = new Context(value, extra);\n  var connected = connectAndSort(value, constraints, context, extra ? extra.path : undefined, true);\n  var promise = Promise.resolve();\n\n  while (connected.length) {\n    (function (list) {\n      promise = promise.then(function () {\n        return Promise.all(list.map(function (c) {\n          return c();\n        }));\n      }) // .then(...delay.then(2500))\n      // .then(a => {\n      //     console.log(`\\n\\n\\n\\n\\n`);\n      //     log.dump('resolved:' + (JSON.stringify(a)+''));\n      //     console.log(`\\n\\n\\n\\n\\n`);\n      //\n      //     return a;\n      // }, a => {\n      //\n      //     console.log(`\\n\\n\\n\\n\\n`);\n      //     log.dump('rejected:' + (JSON.stringify(a)+''));\n      //     console.log(`\\n\\n\\n\\n\\n`);\n      //     return a;\n      // })\n      ;\n    })(connected.shift());\n  }\n\n  var end = function end() {\n    return context.getViolations();\n  };\n\n  return promise.then(end, end);\n};\n\nvalidator.Required = __webpack_require__(/*! ./constraints/Required */ \"./validator/constraints/Required.js\");\nvalidator.Optional = __webpack_require__(/*! ./constraints/Optional */ \"./validator/constraints/Optional.js\");\nvalidator.Collection = __webpack_require__(/*! ./constraints/Collection */ \"./validator/constraints/Collection.js\");\nvalidator.All = __webpack_require__(/*! ./constraints/All */ \"./validator/constraints/All.js\");\nvalidator.Blank = __webpack_require__(/*! ./constraints/Blank */ \"./validator/constraints/Blank.js\");\nvalidator.Callback = __webpack_require__(/*! ./constraints/Callback */ \"./validator/constraints/Callback.js\");\nvalidator.Count = __webpack_require__(/*! ./constraints/Count */ \"./validator/constraints/Count.js\");\nvalidator.Email = __webpack_require__(/*! ./constraints/Email */ \"./validator/constraints/Email.js\");\nvalidator.IsFalse = __webpack_require__(/*! ./constraints/IsFalse */ \"./validator/constraints/IsFalse.js\");\nvalidator.IsNull = __webpack_require__(/*! ./constraints/IsNull */ \"./validator/constraints/IsNull.js\");\nvalidator.IsTrue = __webpack_require__(/*! ./constraints/IsTrue */ \"./validator/constraints/IsTrue.js\");\nvalidator.Length = __webpack_require__(/*! ./constraints/Length */ \"./validator/constraints/Length.js\");\nvalidator.NotBlank = __webpack_require__(/*! ./constraints/NotBlank */ \"./validator/constraints/NotBlank.js\");\nvalidator.NotNull = __webpack_require__(/*! ./constraints/NotNull */ \"./validator/constraints/NotNull.js\");\nvalidator.Regex = __webpack_require__(/*! ./constraints/Regex */ \"./validator/constraints/Regex.js\");\nvalidator.Type = __webpack_require__(/*! ./constraints/Type */ \"./validator/constraints/Type.js\");\nmodule.exports = validator;\n\n//# sourceURL=webpack://spvalidation/./validator/index.js?");

/***/ }),

/***/ "./validator/logic/ConstraintViolationList.js":
/*!****************************************************!*\
  !*** ./validator/logic/ConstraintViolationList.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar set = __webpack_require__(/*! ../utils/set */ \"./validator/utils/set.js\");\n\nvar isArray = __webpack_require__(/*! ../utils/isArray */ \"./validator/utils/isArray.js\");\n/**\n * https://stackoverflow.com/a/14438954\n */\n\n\nfunction onlyUnique(value, index, self) {\n  return self.indexOf(value) === index;\n}\n\nfunction ConstraintViolationList(violations) {\n  this.violations = violations || [];\n}\n\nConstraintViolationList.prototype.getRaw = function () {\n  return this.violations;\n};\n\nConstraintViolationList.prototype.getFlat = function () {\n  var key;\n  return this.violations.reduce(function (acc, v) {\n    key = v[0] || '';\n\n    if (!acc[key]) {\n      acc[key] = [];\n    }\n\n    acc[key].push(v[1]);\n    return acc;\n  }, {});\n};\n\nConstraintViolationList.prototype.getTree = function () {\n  var key = {};\n  return this.violations.reduce(function (acc, v) {\n    key = v[0] || '';\n    acc = set(acc, key += '.', v[1]); // if ( ! acc[key] ) {\n    //\n    //     acc[key] = [];\n    // }\n    //\n    // acc[key].push(v[1]);\n\n    return acc;\n  }, {});\n};\n\nConstraintViolationList.prototype.findByCodes = function (codes) {\n  var _this = this;\n\n  if (!isArray(codes)) {\n    codes = [codes];\n  }\n\n  codes = codes.filter(onlyUnique);\n  var tmp = [];\n\n  var _loop = function _loop(i, l) {\n    tmp = tmp.concat(_this.violations.filter(function (v) {\n      return v[2] === codes[i];\n    }) || []);\n  };\n\n  for (var i = 0, l = codes.length; i < l; i += 1) {\n    _loop(i, l);\n  }\n\n  return tmp;\n};\n\nConstraintViolationList.prototype.count = function () {\n  return this.violations.length;\n};\n\nmodule.exports = ConstraintViolationList;\n\n//# sourceURL=webpack://spvalidation/./validator/logic/ConstraintViolationList.js?");

/***/ }),

/***/ "./validator/logic/Context.js":
/*!************************************!*\
  !*** ./validator/logic/Context.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar ViolationBuilder = __webpack_require__(/*! ./ViolationBuilder */ \"./validator/logic/ViolationBuilder.js\");\n\nvar ConstraintViolationList = __webpack_require__(/*! ../logic/ConstraintViolationList */ \"./validator/logic/ConstraintViolationList.js\");\n\nvar Context = function Context(rootData) {\n  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  this.violations = [];\n  this.rootData = rootData;\n  this.extra = extra;\n  this.stack = {};\n};\n\nContext.prototype.buildViolation = function () {\n  var args = Array.prototype.slice.call(arguments);\n\n  if (args.length === 0) {\n    throw \"new Context(message).buildViolation(message): message not specified\";\n  }\n\n  if (typeof args[0] !== 'string') {\n    throw \"new Context(message).buildViolation(message): message arg must be string\";\n  }\n\n  return new ViolationBuilder(args[0], this);\n};\n\nContext.prototype.addViolation = function (path, message, code, invalidValue) {\n  this.violations.push([path, message, code, invalidValue]);\n};\n\nContext.prototype.addTrigger = function () {\n  var async = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n  var trigger = arguments.length > 1 ? arguments[1] : undefined;\n\n  if (this.stack[async]) {\n    this.stack[async].push(trigger);\n  } else {\n    this.stack[async] = [trigger];\n  }\n\n  return this;\n};\n\nContext.prototype.getTriggers = function () {\n  var _this = this;\n\n  var list = Object.keys(this.stack).sort().reduce(function (acc, key) {\n    _this.stack[key].length && acc.push(_this.stack[key]);\n    return acc;\n  }, []);\n  this.stack = {};\n  return list;\n};\n\nContext.prototype.getViolations = function () {\n  return new ConstraintViolationList(this.violations);\n};\n\nContext.prototype.getRoot = function () {\n  return this.rootData;\n};\n\nContext.prototype.getExtra = function () {\n  return this.extra;\n};\n\nmodule.exports = Context;\n\n//# sourceURL=webpack://spvalidation/./validator/logic/Context.js?");

/***/ }),

/***/ "./validator/logic/ViolationBuilder.js":
/*!*********************************************!*\
  !*** ./validator/logic/ViolationBuilder.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar ViolationBuilder = function ViolationBuilder(message, context) {\n  this.parameters = {};\n  this.code = undefined;\n  this.path = undefined;\n  this.plural = false;\n  this.invalidValue = undefined;\n  this.message = message;\n  this.context = context;\n};\n\nViolationBuilder.prototype.setParameter = function (name, value) {\n  this.parameters[name] = value;\n  return this;\n};\n\nViolationBuilder.prototype.setCode = function (code) {\n  this.code = code;\n  return this;\n};\n\nViolationBuilder.prototype.atPath = function (path) {\n  this.path = path;\n  return this;\n};\n\nViolationBuilder.prototype.setPlural = function (plural) {\n  if (!Number.isInteger(plural) || plural < 0) {\n    throw \"ViolationBuilder.setPlural(plural) - plural parameter should be integer in range 0-inifinty\";\n  }\n\n  this.plural = plural;\n  return this;\n};\n\nViolationBuilder.prototype.setInvalidValue = function (invalidValue) {\n  this.invalidValue = invalidValue;\n  return this;\n};\n\nViolationBuilder.prototype.addViolation = function () {\n  var _this = this;\n\n  if (this.code === undefined) {\n    throw \"ViolationBuilder: this.code === undefined, call ViolationBuilder->setCode(code)\";\n  }\n\n  var message = this.message;\n\n  if (typeof message === 'string' && message.indexOf('|') > -1 && this.plural !== false && this.plural > -1) {\n    var split = message.split('|');\n\n    if (split.length > this.plural) {\n      message = split[this.plural];\n    }\n  }\n\n  Object.keys(this.parameters).map(function (key) {\n    var cp;\n\n    do {\n      cp = message;\n      message = message.replace(key, _this.parameters[key]);\n    } while (cp !== message);\n  });\n  this.context.addViolation(this.path, message, this.code, this.invalidValue);\n  return this;\n};\n\nmodule.exports = ViolationBuilder;\n\n//# sourceURL=webpack://spvalidation/./validator/logic/ViolationBuilder.js?");

/***/ }),

/***/ "./validator/logic/connectAndSort.js":
/*!*******************************************!*\
  !*** ./validator/logic/connectAndSort.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Existence = __webpack_require__(/*! ../prototypes/Existence */ \"./validator/prototypes/Existence.js\");\n\nvar Constraint = __webpack_require__(/*! ../prototypes/Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar All = __webpack_require__(/*! ../constraints/All */ \"./validator/constraints/All.js\");\n\nvar isArray = __webpack_require__(/*! ../utils/isArray */ \"./validator/utils/isArray.js\");\n\nvar each = __webpack_require__(/*! ../utils/each */ \"./validator/utils/each.js\");\n\nvar connectAndSort = function connectAndSort(value, constraints, context, path) {\n  var final = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;\n\n  if (constraints instanceof Existence) {\n    return connectAndSort(value, constraints.getOptions(), context, path, final);\n  }\n\n  if (constraints instanceof Constraint) {\n    if (!isArray(constraints)) {\n      constraints = [constraints];\n    }\n  }\n\n  if (!isArray(constraints)) {\n    if (final) {\n      return context.getTriggers();\n    }\n\n    return;\n  }\n\n  var extra;\n\n  var _loop = function _loop(i, l) {\n    if (constraints[i] instanceof Existence) {\n      connectAndSort(value, constraints[i].getOptions(), context, path);\n    } else if (constraints[i] instanceof All) {\n      var combine = typeof path === 'undefined' ? function (name) {\n        return name;\n      } : function (name) {\n        return path + '.' + name;\n      };\n      var allConstraints = constraints[i].getOptions();\n      each(value, function (v, name) {\n        connectAndSort(v, allConstraints, context, combine(name));\n      });\n    } else {\n      extra = constraints[i].getExtra();\n\n      if (constraints[i].validate) {\n        context.addTrigger(extra.async, function () {\n          return constraints[i].validate(value, context, path, extra);\n        });\n      }\n\n      if (constraints[i].validateChildren) {\n        constraints[i].validateChildren(value, context, path, extra);\n      }\n    }\n  };\n\n  for (var i = 0, l = constraints.length; i < l; i += 1) {\n    _loop(i, l);\n  }\n\n  if (final) {\n    return context.getTriggers();\n  }\n};\n\nmodule.exports = connectAndSort;\n\n//# sourceURL=webpack://spvalidation/./validator/logic/connectAndSort.js?");

/***/ }),

/***/ "./validator/prototypes/Constraint.js":
/*!********************************************!*\
  !*** ./validator/prototypes/Constraint.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isObject = __webpack_require__(/*! ../utils/isObject */ \"./validator/utils/isObject.js\");\n\nfunction Constraint() {\n  if (!(this instanceof Constraint)) {\n    throw \"It is necessary to use operotr 'new' with all constraints\";\n  }\n}\n\n;\nvar sufix = '_ERROR';\nvar sufix_length = sufix.length;\n\nConstraint.prototype.errorNames = function () {\n  var _this = this;\n\n  if (!Constraint.prototype._errorNames) {\n    Constraint.prototype._errorNames = Object.keys(this.constructor.prototype).reduce(function (acc, key) {\n      var val = _this.constructor.prototype[key];\n\n      if (typeof val === 'string' && key === key.toUpperCase() && key.substring(key.length - sufix_length) === sufix) {\n        acc[key] = key;\n      }\n\n      return acc;\n    }, {});\n  }\n\n  return Constraint.prototype._errorNames;\n};\n\nConstraint.prototype.getOptions = function () {\n  return this.opt;\n};\n\nConstraint.prototype.setOptions = function (opt) {\n  this.opt = opt;\n  return this;\n};\n\nConstraint.prototype.setExtra = function (extra) {\n  this.extra = extra;\n  return this;\n};\n\nConstraint.prototype.getExtra = function () {\n  if (isObject(this.extra)) {\n    return this.extra;\n  }\n\n  if (typeof this.extra === 'string') {\n    return this.extra;\n  }\n\n  return {};\n}; // Constraint.prototype.validate = function (value, context) {}\n\n\nConstraint.prototype.validate = false; // Constraint.prototype.validateChildren = function (value, context) {}\n\nConstraint.prototype.validateChildren = false;\nmodule.exports = Constraint;\n\n//# sourceURL=webpack://spvalidation/./validator/prototypes/Constraint.js?");

/***/ }),

/***/ "./validator/prototypes/Existence.js":
/*!*******************************************!*\
  !*** ./validator/prototypes/Existence.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Constraint = __webpack_require__(/*! ./Constraint */ \"./validator/prototypes/Constraint.js\");\n\nvar Existence = function Existence() {\n  Constraint.apply(this, arguments); // call super constructor.\n};\n\nExistence.prototype = Object.create(Constraint.prototype);\nExistence.prototype.constructor = Existence;\nmodule.exports = Existence;\n\n//# sourceURL=webpack://spvalidation/./validator/prototypes/Existence.js?");

/***/ }),

/***/ "./validator/utils/arrayIntersect.js":
/*!*******************************************!*\
  !*** ./validator/utils/arrayIntersect.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isArray = __webpack_require__(/*! ./isArray */ \"./validator/utils/isArray.js\");\n\nmodule.exports = function (a, b) {\n  if (!isArray(a)) {\n    return [];\n  }\n\n  if (!isArray(b)) {\n    return [];\n  }\n\n  return a.reduce(function (acc, val) {\n    if (b.indexOf(val) > -1) {\n      acc.push(val);\n    }\n\n    return acc;\n  }, []);\n};\n\n//# sourceURL=webpack://spvalidation/./validator/utils/arrayIntersect.js?");

/***/ }),

/***/ "./validator/utils/each.js":
/*!*********************************!*\
  !*** ./validator/utils/each.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isArray = __webpack_require__(/*! ./isArray */ \"./validator/utils/isArray.js\");\n\nvar isObject = __webpack_require__(/*! ./isObject */ \"./validator/utils/isObject.js\");\n\nmodule.exports = function each(obj, fn, context) {\n  var r;\n\n  if (isArray(obj)) {\n    for (var i = 0, l = obj.length; i < l; ++i) {\n      if (fn.call(context, obj[i], i) === false) {\n        return;\n      }\n    }\n  } else if (isObject(obj)) {\n    for (var i in obj) {\n      if (obj.hasOwnProperty(i)) {\n        if (fn.call(context, obj[i], i) === false) {\n          return;\n        }\n      }\n    }\n  }\n};\n\n//# sourceURL=webpack://spvalidation/./validator/utils/each.js?");

/***/ }),

/***/ "./validator/utils/isArray.js":
/*!************************************!*\
  !*** ./validator/utils/isArray.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction isArray(obj) {\n  return Object.prototype.toString.call(obj) === '[object Array]';\n}\n\n;\nmodule.exports = isArray;\n\n//# sourceURL=webpack://spvalidation/./validator/utils/isArray.js?");

/***/ }),

/***/ "./validator/utils/isObject.js":
/*!*************************************!*\
  !*** ./validator/utils/isObject.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction isObject(obj) {\n  return Object.prototype.toString.call(obj) === '[object Object]';\n}\n\n;\nmodule.exports = isObject;\n\n//# sourceURL=webpack://spvalidation/./validator/utils/isObject.js?");

/***/ }),

/***/ "./validator/utils/set.js":
/*!********************************!*\
  !*** ./validator/utils/set.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isArray = __webpack_require__(/*! ./isArray */ \"./validator/utils/isArray.js\");\n\nvar isObject = __webpack_require__(/*! ./isObject */ \"./validator/utils/isObject.js\");\n\nfunction set(source, key, value) {\n  if (typeof key === 'string') {\n    key = key.split('.');\n  }\n\n  if (typeof key === 'number') {\n    key = key + '';\n  }\n\n  if (isObject(key)) {\n    key = Object.values(key).map(function (a) {\n      return a += '';\n    });\n  }\n\n  if (typeof key !== 'string' && !key && key !== '0' && key !== '') {\n    key = [];\n  }\n\n  if (!isArray(key)) {\n    key = [key];\n  }\n\n  if (key.length) {\n    var first = true;\n    var ar = isArray(source);\n\n    if (!ar && !isObject(source)) {\n      source = {};\n    }\n\n    var kt;\n    var tmp = source;\n    var tmp2 = source;\n    var obb, arr;\n\n    while (key.length) {\n      kt = key.shift();\n\n      if (first) {\n        first = false;\n\n        if (ar && !/^\\d+$/.test(kt) && kt !== '') {\n          throw \"if source is array and key is not integer nor empty string then its not possible to add to array, given key: \" + JSON.stringify(kt);\n        }\n      }\n\n      tmp = tmp2;\n\n      if (key.length) {\n        obb = isObject(tmp[kt]);\n        arr = isArray(tmp[kt]);\n\n        if (!(obb || arr)) {\n          if (key[0] === '') {\n            arr || (tmp[kt] = []);\n          } else {\n            obb || (tmp[kt] = {});\n          }\n        }\n\n        tmp2 = tmp[kt];\n      } else {\n        if (isArray(tmp)) {\n          if (kt === '') {\n            tmp.push(value);\n          } else {\n            tmp[kt] = value;\n          }\n        } else {\n          tmp[kt] = value;\n        }\n\n        return source;\n      }\n    }\n  }\n\n  return value;\n}\n\nmodule.exports = set;\n\n//# sourceURL=webpack://spvalidation/./validator/utils/set.js?");

/***/ })

/******/ });
});