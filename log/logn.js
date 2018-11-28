/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */
'use strict';

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

    module.exports = require('./logw');
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
