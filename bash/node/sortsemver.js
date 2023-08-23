/**
 *
 *
cat <<EOF | node ../bash/node/sortsemver.js


 0.0.10
 0.0.10
 1.2.9
 1.70.9
 1.3.7
 0.0.8
 0.11.7
 0.0.8
 ver0.0.6dd
 0.0.6
 0.0.5
 0.0.5
 1.0.3
 0.0.4
 0.0.0
 0.0.4
 0.5.2
 0.0.2
 0.10.1
 0.0.2
 0.0.1

EOF

 */

/**
 * https://github.com/leohihimax/node-version-compare/blob/master/index.js
 * @param v1
 * @param v2
 * @returns {number}
 */
function compare(v1, v2) {
  var flag1 = v1.indexOf("-") > -1;
  var flag2 = v2.indexOf("-") > -1;
  var arr1 = split(flag1, v1);
  var arr2 = split(flag2, v2);
  arr1 = convertToNumber(arr1);
  arr2 = convertToNumber(arr2);
  var len = Math.max(arr1.length, arr2.length);
  for (var i = 0; i < len; i++) {
    // 1.0.0 > 1.0.0-beta.2
    if (i === 3 && (arr1[i] === undefined || arr2[i] === undefined)) {
      if (arr1[i] === undefined && isNaN(arr2[i])) {
        return 1;
      } else if (isNaN(arr1[i]) && arr2[i] === undefined) {
        return -1;
      }
    }
    if (arr1[i] === undefined) {
      return -1;
    } else if (arr2[i] === undefined) {
      return 1;
    }
    if (arr1[i] > arr2[i]) {
      return 1;
    } else if (arr1[i] < arr2[i]) {
      return -1;
    }
  }
  return 0;
}

function split(flag, version) {
  var result = [];
  if (flag) {
    var tail = version.split("-")[1];
    var _version = version.split("-")[0];
    result = _version.split(".");
    tail = tail.split(".");
    result = result.concat(tail);
  } else {
    result = version.split(".");
  }
  return result;
}

function convertToNumber(arr) {
  return arr.map(function (el) {
    return isNaN(el) ? el : parseInt(el);
  });
}

const log = console.log;

let result = "";

const { stdin } = process;

if (stdin.isTTY) {
  log("isTTY");

  sort(result);

  process.exit(0);
}

stdin.setEncoding("utf8");

stdin.on("data", function (d) {
  result += d;
});

stdin.on("end", () => sort(result));

const reg = /^(.*?)(\d+)\.(\d+)\.(\d+)(.*)$/;

function sort(data) {
  data = data.split("\n");

  data = data.map((d) => d.trim());

  data = data.filter(Boolean);

  data = data.filter((d) => reg.test(d));

  data = data.map((d) => d.match(reg));

  data = data.map((d) => {
    d[2] = parseInt(d[2], 10);
    d[3] = parseInt(d[3], 10);
    d[4] = parseInt(d[4], 10);
    return d;
  });

  data.sort((a, b) => compare(`${a[2]}.${a[3]}.${a[4]}`, `${b[2]}.${b[3]}.${b[4]}`));

  data = data.map((d) => `${d[1]}${d[2]}.${d[3]}.${d[4]}${d[5]}`);

  process.stdout.write(data.join("\n"));
}
