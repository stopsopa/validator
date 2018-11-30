/**
 * @author Szymon Działowski
 * @license MIT License (c) copyright 2017-present original author or authors
 * @homepage https://github.com/stopsopa/roderic
 */

'use strict';

var glob        = require("glob");
var path        = require("path");
// var colors      = require('colors');
var fs          = require('fs');
// var mkdirp      = require('mkdirp');

function json(data) {
    return JSON.stringify(data, null, '    ').replace(/\\\\/g, '\\');
}

function findentries(root, mask, appdir) {

    if (typeof mask === 'undefined') {

        mask = "/**/*.test.js";
    }

    const list = glob.sync(root + mask);

    let tmp, entries = {};

    let filter = false;

    if (process.env.KARMAFILTER) {

        filter = process.env.KARMAFILTER.replace('-', '/').replace('karma_build/', '')
    }

    for (let i = 0, l = list.length ; i < l ; i += 1) {

        tmp = path.parse(list[i]);

                                    const dir = (path.relative(appdir, tmp.dir).replace(/[^a-z]/, '-'));

        // console.log(JSON.stringify({
        //     tmp,
        //     o: tmp.dir,
        //     rel: path.relative(appdir, tmp.dir),
        //     wtf: (dir ? (dir + '-') : '')+path.basename(tmp.name, path.extname(tmp.name))
        // }, null, 4));

        tmp = path.basename(tmp.name, path.extname(tmp.name));

                                    tmp = (dir ? (dir + '-') : '') + tmp;

        if (entries[tmp]) {

            throw "There are two entry files with the same name: '" + path.basename(entries[tmp]) + "'"
        }


                                    /**
                                     * Excluding /test/jest/
                                     */

                                    if (filter) {

                                        if (filter && list[i].indexOf(filter) > -1) {

                                            entries[tmp] = list[i];
                                        }
                                    }
                                    else if (list[i].indexOf('/lib/test/jest/') === -1) {

                                        entries[tmp] = list[i];
                                    }






    }

    console.log(JSON.stringify({
        entries,
        d: filter
    }, null, 4));
    //
    // process.exit(1);

    return entries;
}

function dirEnsure(dir, createIfNotExist) {

    if ( fs.existsSync(dir) ) {

        if ( ! fs.lstatSync(dir).isDirectory() ) {

            throw "'" + dir + "' is not directory";
        }
    }
    else {

        if (createIfNotExist) {

            try {

                mkdirp.sync(dir);

                if ( ! fs.existsSync(dir) ) {

                    throw "Directory '" + dir + "' doesn't exist, check after mkdirp.sync(" + dir + ")";
                }
            }
            catch (e) {

                throw "Can't create directory '" + dir + "', error: " + e;
            }
        }
        else {

            throw "Directory '" + dir + "' doesn't exist, (createIfNotExist = false) check";
        }
    }
}

var symlinkEnsure = (function () {
    function unique(pattern) {
        pattern || (pattern = 'file-xyxyxyxyxyxyxyxyxy.tmp');
        return pattern.replace(/[xy]/g,
            function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
    return function (target, dir, colors) {

        // if (colors) {
        //
        //     console && console.log && console.log("\n        link: ".yellow, path.dirname(target) + path.sep + path.basename(target).green, "\n        path: ".yellow, dir);
        // }
        // else {
        //
        //     console && console.log && console.log("\n        link: ".yellow, target, "\n        path: ".yellow, dir);
        // }

        if ( fs.existsSync(target) ) {

            if ( ! fs.lstatSync(target).isSymbolicLink() ) {

                throw "'" + target + "' is not symlink";
            }
        }
        else {

            try {

                var dirWhereToLink = path.resolve(target, '..');

                var relative = path.relative(dirWhereToLink, dir);

                process.chdir(dirWhereToLink);

                fs.symlinkSync(relative, target, 'dir');

                if ( ! fs.existsSync(target) ) {

                    throw "Symlink '" + target + "' can't be created";
                }

                process.chdir(__dirname);
            }
            catch (e) {

                throw "Symlink '" + target + "' can't be created for path '" + relative
                + "', \n\n   " + json({
                    sym                     : target,
                    dir                     : dir,
                    relative                : relative,
                    "__dirname        "     : __dirname,
                    "process.cwd() now"     : process.cwd(),
                })
                + " ', \n\n    exception error:\n    " + e;
            }
        }

        // now test to be sure

        var file = unique();

        var dirfile = path.resolve(dir, file);

        var targetfile = path.resolve(target, file);

        fs.closeSync(fs.openSync(dirfile, 'w'));

        if ( fs.existsSync(dirfile) ) {

            if ( ! fs.lstatSync(dirfile).isFile() ) {

                throw "Weird, created test file '" + dirfile + "' is not file";
            }
        }
        else {

            throw "Can't create test file '" + dirfile + "'";
        }

        if ( fs.existsSync(targetfile) ) {

            if ( ! fs.lstatSync(targetfile).isFile() ) {

                throw "Weird, created test file '" + targetfile + "' exist but is not file";
            }

            fs.unlinkSync(dirfile);

            if ( fs.existsSync(targetfile) ) {

                throw "Test file '" + targetfile + "' should be now deleted, but it still exist";
            }
        }
        else {

            throw "Test file '" + dirfile + "' has been created but is not visible on the other side of symlink '" + targetfile + "', seems like wrong symlink";
        }
    }
}());

var utils = {
    config: false,
    setup: function (setup) {

        if (setup && !this.config) {

            this.config = require(setup);
        }

        // console && console.log && console.log('env: '.yellow + this.env.red + "\n");

        return this.env;
    },
    entries: function (mask, suppressNotFoundError) {

        var t, i, tmp = {}, root = this.config.js.entries, app = this.config.app;

        if (!root) {

            throw "First specify root path for entry";
        }

        if (Object.prototype.toString.call( root ) !== '[object Array]') {

            root = [root];
        }

        root.forEach(function (r) {

            t = findentries(r, mask, app);

            for (i in t) {

                if (tmp[i]) {

                    throw "There are two entry files with the same name: '" + path.basename(t[i]) + "'"
                }

                tmp[i] = t[i];
            }
        });

        if ( ! suppressNotFoundError && ! Object.keys(tmp).length) {

            throw "Not found *.entry.js files in directories : \n" + json(root, null, '    ');
        }

        return tmp;
    },
    symlink : function (list, colors, justList) {

        var fsdir, dir, link, nlist = [];

        list.forEach(function (p) {

            if (typeof p === 'string') {

                // justList || (console && console.log && console.log("\n        path: ".yellow, p));

                nlist.push(p);
            }
            else {

                if (typeof p.link !== 'string') {

                    throw "'link' is not defined in resolve path object: \n" + json(p);
                }

                if (typeof p.path !== 'string') {

                    throw "'path' is not defined in resolve path object: \n" + json(p);
                }

                if ( ! justList) {

                    dir = path.dirname(p.link);

                    try {

                        dirEnsure(dir, true);

                        dirEnsure(p.path);
                    }
                    catch (e) {

                        throw "dirEnsure() error on resolve object: \n" + json(p) + "\n    error:\n        " + e;
                    }

                    symlinkEnsure(p.link, p.path, colors);
                }

                nlist.push(p.link);
            }
        });

        return nlist;
    }
};

utils.env   = process.env.WEBPACK_MODE || 'dev';

utils.dev   = (utils.env === 'dev');

utils.prod  = !utils.dev;

module.exports = utils;


