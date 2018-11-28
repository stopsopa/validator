/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */

'use strict';

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