/**
 * node bash/kuber/determine-latest-tag.js a4.4.6b a4.3.6b 2.0.106-hub_aml aaa fdsa1.0.9ddd 0.0.107-hub_aml "xxx"
 *
 * return a4.4.6b
 */

process.argv.shift();

process.argv.shift();

const reg = /^.*?(\d\.\d+\.\d+).*$/;

let list = process.argv
  .filter((r) => Boolean(r.trim()))
  .map((ver) => {
    return {
      ver,
      sem: ver.replace(reg, "${1}"),
    };
  });

/**
 * https://stackoverflow.com/a/6832706
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var a_components = a.split(".");
  var b_components = b.split(".");

  var len = Math.min(a_components.length, b_components.length);

  // loop while the components are equal
  for (var i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return 1;
    }

    // B bigger than A
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return -1;
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1;
  }

  if (a_components.length < b_components.length) {
    return -1;
  }

  // Otherwise they are the same.
  return 0;
}

list.sort((a, b) => compare(a.sem, b.sem));

let sem = list.pop();

function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}

if (isObject(sem) && typeof sem.sem === "string") {
  ver = sem.ver.trim();

  if (ver) {
    process.stdout.write(ver);
  }
}
