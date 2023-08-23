/**
 * Require: "js-yaml": "^3.11.0",
 *
 * node ${0} _ key.key
 * node ${0} 0 key.key
 * node ${0} 1 key.key
 * node ${0} title key.key
 */
if (Object.keys(process.argv).length < 4) {
  throw `Not enough arguments: run:
    
    node ${__filename} path/to/yml/file.yml [_|0|1|..] key.to.value"    
`;
}

const path = require("path");

const fs = require("fs");

const log = function (data) {
  console.log(JSON.stringify(data, null, 4));
};

const file = path.resolve(process.cwd(), process.argv[2]);

const block = process.argv[3];

const key = process.argv[4];

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
const getold = function (source, key) {
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

function parse(yml) {
  const dic = {};

  if (typeof yml !== "string") {
    throw new Error(`parse: yml is not a string`);
  }

  yml = yml.split("\n");

  let ind = [],
    i = 0;

  for (let k = 0, l = yml.length; k < l; k += 1) {
    if (!isObject(dic[i])) {
      dic[i] = dic._ = ind[i] = { v: "" };
    }

    if (yml[k].indexOf("---") === 0) {
      i += 1;

      let label = yml[k]
        .replace(/^-+(.*)$/, "$1")
        .trim()
        .toLowerCase();

      if (!isObject(dic[i])) {
        dic[i] = ind[i] = { v: "", r: yml[k] };

        if (isObject(dic[label])) {
          if (typeof dic[label].v === "string") {
            dic[label].e = new Error(`There are more than one sections with label '${label}'`);
          }
        } else {
          dic[label] = ind[i];
        }
      }

      continue;
    }

    ind[i].v += yml[k] + "\n";
  }

  for (let i = 0, l = ind.length; i < l; i += 1) {
    ind[i].v = yaml.safeLoad(ind[i].v);
  }

  return {
    ind,
    dic,
  };
}

const yaml = require("js-yaml");

let yml = fs.readFileSync(file, "utf8").toString();

const data = parse(yml);

if (!isObject(data.dic[block])) {
  throw new Error(`Block targeted by string '${block}' is not defined in file '${file}'`);
}

if (!/^\d+$/.test(block) && data.dic[block].e instanceof Error) {
  throw data.dic[block].e;
}

const ret = getold(data.dic[block].v, key);

if (isObject(ret) || isArray(ret)) {
  console.log(yaml.safeDump(ret));

  process.exit(0);
}

console.log(ret);
