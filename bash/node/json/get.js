// console.log(JSON.stringify(process.argv, null, 4));

if (Object.keys(process.argv).length < 4) {
  throw `Not enough arguments: run:
    
    node ${__filename} path/to/json/file.json key.to.value"    
`;
}

const path = require("path");

const fs = require("fs");

const file = path.resolve(process.cwd(), process.argv[2]);

const key = process.argv[3];

// const value     = process.argv[4];

if (!fs.existsSync(file)) {
  throw `File "${file}" doesn't exist`;
}

try {
  fs.accessSync(file, fs.constants.R_OK);
} catch (e) {
  throw `file '${file}' is not readdable`;
}

// try {
//     fs.accessSync(file, fs.constants.W_OK);
// }
// catch (e) {
//
//     throw `file '${file}' is not writtable`;
// }

function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

/**
 *
 * @param source
 * @param key
 * @param jsonIfNotString - for grabbing errors mode - get all but serialized you can then
 * query again with more direct path
 * @returns {*}
 */
const get = function (source, key) {
  // log('key', key);
  // log('source', source)

  if (!key) {
    return source;
  }

  if (typeof key === "string" && key.includes(".")) {
    key = key.split(".");
  }

  if (!isArray(key)) {
    key = [key];
  }

  let tmp = source,
    k;

  while ((k = key.shift())) {
    try {
      if (key.length) {
        tmp = tmp[k];
      } else {
        if (typeof tmp[k] === "undefined") {
          return arguments[2];
        }

        return tmp[k];
      }
    } catch (e) {
      return arguments[2];
    }
  }
};

const json = require(file);

const ret = get(json, key);

if (isObject(ret) || isArray(ret)) {
  console.log(JSON.stringify(ret, null, 4));

  process.exit(0);
}

console.log(ret);

// test.js
// node bash/docker-registry/test.js
// will print: 'call if'
// if (require.main === module) {
//
//     // standalone mode
//
//     console.log('call if')
// }
// else {
//
//     // lib mode
//
//     console.log('call else')
// }
