// console.log(JSON.stringify(process.argv, null, 4));

if (Object.keys(process.argv).length < 5) {
  throw `Not enough arguments: run:
    
    node ${__filename} path/to/yml/file.yml key.to.write "value"    
`;
}

const path = require("path");

const fs = require("fs");

const file = path.resolve(process.cwd(), process.argv[2]);

const key = process.argv[3];

let value = process.argv[5];

let type = process.argv[6] || false;

if (type) {
  const parts = type.split(/[\[\]]/g);

  const precision = parseInt(parts[1] || "2", 10);

  if (parts && parts[0]) {
    type = parts[0];
  }

  switch (type) {
    case "integer":
    case "int":
      value = parseInt(value, 10);
      break;
    case "float":
    case "double":
      value = parseFloat(parseFloat(value, 10).toFixed(precision));
      break;
    case "boolean":
    case "bool":
      value = Boolean(value);
      break;
    default:
  }
}

if (!fs.existsSync(file)) {
  throw `File "${file}" doesn't exist`;
}

try {
  fs.accessSync(file, fs.constants.R_OK);
} catch (e) {
  throw `file '${file}' is not readdable`;
}

try {
  fs.accessSync(file, fs.constants.W_OK);
} catch (e) {
  throw `file '${file}' is not writtable`;
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function set(source, key, value) {
  if (typeof key === "string") {
    key = key.split(".");
  }

  if (typeof key === "number") {
    key = key + "";
  }

  if (isObject(key)) {
    key = Object.values(key).map((a) => (a += ""));
  }

  if (typeof key !== "string" && !key && key !== "0" && key !== "") {
    key = [];
  }

  if (!isArray(key)) {
    key = [key];
  }

  if (key.length) {
    let first = true;

    let ar = isArray(source);

    if (!ar && !isObject(source)) {
      source = {};
    }

    let kt;

    let tmp = source;

    let tmp2 = source;

    let obb, arr;

    while (key.length) {
      kt = key.shift();

      if (first) {
        first = false;

        if (ar && !/^\d+$/.test(kt) && kt !== "") {
          throw (
            `if source is array and key is not integer nor empty string then its not possible to add to array, given key: ` +
            JSON.stringify(kt)
          );
        }
      }

      tmp = tmp2;

      if (key.length) {
        obb = isObject(tmp[kt]);

        arr = isArray(tmp[kt]);

        if (!(obb || arr)) {
          if (key[0] === "") {
            arr || (tmp[kt] = []);
          } else {
            obb || (tmp[kt] = {});
          }
        }

        tmp2 = tmp[kt];
      } else {
        if (isArray(tmp)) {
          if (kt === "") {
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

const yaml = require("js-yaml");

let yml = fs.readFileSync(file, "utf8").toString();

yml = yaml.safeLoad(yml);

set(yml, key, value);

const dump = yaml.safeDump(yml);

fs.writeFileSync(file, dump);

yml = fs.readFileSync(file, "utf8").toString();

yml = yaml.safeLoad(yml);

yml = yaml.safeDump(yml);

if (yml !== dump) {
  console.log("ERROR: couldn't change value");

  process.exit(1);
}

console.log("Success");
