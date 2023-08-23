// console.log(JSON.stringify(process.argv, null, 4));

if (Object.keys(process.argv).length < 4) {
  throw `Not enough arguments: run:
    
    node ${__filename} path/to/yml/file.yml key.to.value"    
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
 * @param ymlIfNotString - for grabbing errors mode - get all but serialized you can then
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

const yaml = require("js-yaml");

let yml = fs.readFileSync(file, "utf8").toString();

yml = yaml.safeLoad(yml);

const ret = get(yml, key);

if (isObject(ret) || isArray(ret)) {
  console.log(yaml.safeDump(ret));

  process.exit(0);
}

console.log(ret);
