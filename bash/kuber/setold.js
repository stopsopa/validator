/**
 * Require: "js-yaml": "^3.11.0",
 *
 it is possible to just use labels like:

--- some label
------ even with more dashes
--- dep1

 # default first block
 node ${0} 001-simple-app/kubernetes/piiapp.yaml _ add new-value
 node ${0} 001-simple-app/kubernetes/piiapp.yaml 0 add new-value
 node ${0} 001-simple-app/kubernetes/piiapp.yaml 3 add new-value
 node ${0} 001-simple-app/kubernetes/piiapp.yaml titlefromdashline add new-value
 node ${0} 001-simple-app/kubernetes/piiapp.yaml 3 deep.key "multilime value"

 force type:
 node $0 001-simple-app/kubernetes/piiapp.yaml _spec.replicas key 678.456795645 float[3]
        float[3] - float precision 3
 */

if (Object.keys(process.argv).length < 5) {
  throw `Not enough arguments: run:
    
    node ${__filename} path/to/yml/file.yml key.to.write "value"    
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

function setold(source, key, value) {
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

function dump(data) {
  let tmp = "";

  for (let i = 0, l = data.ind.length; i < l; i += 1) {
    if (typeof data.ind[i].r === "string") {
      tmp += data.ind[i].r + "\n";
    }

    tmp += yaml.safeDump(data.ind[i].v).trim() + "\n";
  }

  return tmp;
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

setold(data.dic[block].v, key, value);

const saved = dump(data);

fs.writeFileSync(file, saved);

yml = fs.readFileSync(file, "utf8").toString();

yml = dump(parse(yml));

if (yml !== saved) {
  console.log("ERROR: couldn't change value");

  process.exit(1);
}

console.log("Success");
