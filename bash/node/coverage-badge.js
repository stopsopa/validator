/**
 * badge svg taken from: https://github.com/jpb06/jest-badges-action
 * 
 * to generate use jest.config.js:
    {
        ...
        coverageReporters: ["html", "text"],
    }

    // more about https://github.com/stopsopa/nlab

    gather text report from jest:

    /bin/bash jest.sh | tee coverage/for-coverage-badge.log

    then you generate svg badge file:

    cat coverage/for-coverage-badge.log | node bash/node/coverage-badge.js --output coverage/coverage-badge.svg

    and then you add badge to README.md:

    ![jest coverage](https://stopsopa.github.io/nlab/coverage/coverage-badge.svg)   
    
    # NOTICE: there is script bash/node/coverage-badge-clean.sh for cleaning directory coverage/*

    -----------------
    coverage badge tresholds:
    
    95 up to and including 100% - good ( #4c1 )
    90 up to 95% - acceptable ( #a3c51c )
    75 up to 90% - medium ( #dfb317 )
    0 up to 75% - low ( #e05d44 )
    no coverage - unknown ( #9f9f9f )
      from: https://docs.gitlab.com/ee/user/project/badges.html#test-coverage-report-badge-colors-and-limits
            g(gitlab Test coverage report badge colors and limits)
      
            or from: https://labs.etsi.org/rep/help/user/project/badges.md#test-coverage-report-badge-colors-and-limits

          

 */

const fs = require("fs");

const script = "coverage-badge.js";

const th = (msg) => new Error(`${script} error: ${msg}`);

const args = (function (obj, tmp) {
  process.argv.slice(2).map((a) => {
    if (a.indexOf("--") === 0) {
      tmp = a.substring(2).replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");

      if (tmp) {
        obj[tmp] = typeof obj[tmp] === "undefined" ? true : obj[tmp];
      }

      return;
    }

    if (a === "true") {
      a = true;
    }

    if (a === "false") {
      a = false;
    }

    if (tmp !== null) {
      if (obj[tmp] === true) {
        return (obj[tmp] = [a]);
      }

      try {
        obj[tmp].push(a);
      } catch (e) {}
    }
  });

  Object.keys(obj).map((k) => {
    obj[k] !== true && obj[k].length === 1 && (obj[k] = obj[k][0]);
    obj[k] === "false" && (obj[k] = false);
  });

  return {
    count: () => Object.keys(obj).length,
    all: () => JSON.parse(JSON.stringify(obj)),
    get: (key, def) => {
      var t = JSON.parse(JSON.stringify(obj));

      if (typeof def === "undefined") return t[key];

      return typeof t[key] === "undefined" ? def : t[key];
    },
    string: (key, def) => {
      var t = JSON.parse(JSON.stringify(obj));

      return typeof t[key] === "string" ? t[key] : def;
    },
  };
})({});

const file = args.get("output");

if (typeof file !== "string") {
  throw th(`--output argument is not specified`);
}

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false, // This allows reading without echoing input
});

const p = [];

function add(...args) {
  args.forEach((d) => p.push(parseFloat(d)));
}

const reg = /^.*?\|\s*([\d\.]+)\s*\|\s*([\d\.]+)\s*\|\s*([\d\.]+)\s*\|\s*([\d\.]+).*$/;

let lines = [];

// (87.47 + 93.27 + 90.34 + 87.58) / 4
// 89.665
rl.on("line", (line) => {
  if (lines.length < 4) {
    if (lines.length > 1) {
      lines.push(line);
    }

    if (line.includes("Uncovered Line #s")) {
      lines.push(line);
    } else if (lines.length < 2) {
      lines[0] = line;
    }
  } else {
    const foundLine = lines.at(-1);

    let foundNumbers;

    let math;

    let m = foundLine.match(reg);

    if (Array.isArray(m) && m.length === 5) {
      const [_, a, b, c, d] = m;

      foundNumbers = `${script} found numbers: ${a} ${b} ${c} ${d}`;

      math = `(${a} + ${b} + ${c} + ${d}) / 4 = `;

      add(a, b, c, d);
    }

    let result = 0;

    if (p.length > 0) {
      const sum = p.reduce((acc, x) => acc + x, 0);

      result = (sum / p.length).toFixed(2);

      const t = result.split(".");

      t[1] = trim(t[1], "0", "r");

      result = t[0];

      if (t[1]) {
        result += "." + t[1];
      }
    }

    math += String(result);

    let color = "#9f9f9f";

    if (typeof result === "string") {
      if (result >= 0) {
        color = "#e05d44";
      }

      if (result >= 75) {
        color = "#dfb317";
      }

      if (result >= 90) {
        color = "#a3c51c";
      }

      if (result >= 95) {
        color = "#4c1";
      }
    }

    if (typeof result === "string") {
      if (result.length === 1) {
        result = `0${result}.0`;
      }

      if (result.length < 4) {
        result += ".0";
      }
    }

    console.log(`
${script} report:

  foundLine     : ${foundLine}

  foundNumbers  : ${foundNumbers}

  math          : ${math}

  result: 
    coverage percentage : ${result}%
    color               : ${color} 
    url encoded         : data:image/svg+xml;base64,${Buffer.from(
      `<svg xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='300' height='200' fill='${color}' /></svg>`,
    ).toString("base64")}

    file: >${file}< generated
  
  `);

    fs.writeFileSync(
      file,
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="155" height="20" role="img" aria-label="jest coverage: ${result}%"><title>jest coverage: ${result}%</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="155" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="102" height="20" fill="#555"/><rect x="102" width="53" height="20" fill="${color}"/><rect width="155" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><image x="5" y="3" width="14" height="14" xlink:href="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZXNtb2tlIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+SmVzdDwvdGl0bGU+PHBhdGggZD0iTTIyLjI1MSAxMS44MmEzLjExNyAzLjExNyAwIDAgMC0yLjMyOC0zLjAxTDIyLjkxMSAwSDguMTA0TDExLjEgOC44MzhhMy4xMTYgMy4xMTYgMCAwIDAtMi4yNDQgMi45ODhjMCAxLjA0My41MiAxLjk2NyAxLjMxMyAyLjUzNmE4LjI3OSA4LjI3OSAwIDAgMS0xLjA4NCAxLjI0NCA4LjE0IDguMTQgMCAwIDEtMi41NSAxLjY0N2MtLjgzNC0uNTYzLTEuMTk1LTEuNTU2LS44NjktMi40NDZhMy4xMSAzLjExIDAgMCAwLS45MS02LjA4IDMuMTE3IDMuMTE3IDAgMCAwLTMuMTEzIDMuMTEzYzAgLjg0OC4zNDcgMS42MjYuOTAzIDIuMTgyLS4wNDguMDk3LS4wOTcuMTk1LS4xNDYuMjk5LS40NjUuOTU5LS45OTMgMi4wNDMtMS4xOTUgMy4yNTktLjQwMyAyLjQzMi4yNTcgNC4zODQgMS44NDkgNS40ODlBNS4wOTMgNS4wOTMgMCAwIDAgNS45OTkgMjRjMS44MjcgMCAzLjY4Mi0uOTE3IDUuNDc1LTEuODA3IDEuMjc5LS42MzIgMi41OTktMS4yOTIgMy44OTgtMS42MTIuNDgtLjExOC45OC0uMTg3IDEuNTA4LS4yNjQgMS4wNy0uMTUzIDIuMTc1LS4zMTIgMy4xNjgtLjg5YTQuNDgyIDQuNDgyIDAgMCAwIDIuMTgyLTMuMDkxYy4xNzQtLjk5NCAwLTEuOTk0LS40NDQtMi44Ny4yOTgtLjQ4LjQ2NS0xLjA0Mi40NjUtMS42NDd6bS0xLjM1NSAwYzAgLjk2NS0uNzg1IDEuNzUtMS43NSAxLjc1YTEuNzUzIDEuNzUzIDAgMCAxLTEuMDg1LTMuMTI2bC4wMDctLjAwN2MuMDU2LS4wNDIuMTE4LS4wODQuMTgtLjEyNSAwIDAgLjAwOCAwIC4wMDgtLjAwNy4wMjgtLjAxNC4wNTUtLjAzNS4wODMtLjA1LjAwNyAwIC4wMTQtLjAwNi4wMjEtLjAwNi4wMjgtLjAxNC4wNjMtLjAyOC4wOTctLjA0Mi4wMzUtLjAxNC4wNy0uMDI3LjA5OC0uMDQxLjAwNyAwIC4wMTMtLjAwNy4wMi0uMDA3LjAyOC0uMDA3LjA1Ni0uMDIxLjA4NC0uMDI4LjAwNyAwIC4wMi0uMDA3LjAyOC0uMDA3LjAzNC0uMDA3LjA2Mi0uMDE0LjA5Ny0uMDJoLjAwN2wuMTA0LS4wMjJjLjAwNyAwIC4wMiAwIC4wMjgtLjAwNy4wMjggMCAuMDU1LS4wMDcuMDgzLS4wMDdoLjAzNWMuMDM1IDAgLjA3LS4wMDcuMTExLS4wMDdoLjA5Yy4wMjggMCAuMDUgMCAuMDc3LjAwN2guMDE0Yy4wNTUuMDA3LjExMS4wMTQuMTY3LjAyOGExLjc2NiAxLjc2NiAwIDAgMSAxLjM5NiAxLjcyM3pNMTAuMDQzIDEuMzloMTAuOTNsLTIuNTA5IDcuNGMtLjEwNC4wMi0uMjA4LjA1NS0uMzEyLjA5bC0yLjY0LTUuMzg1LTIuNjQ4IDUuMzVjLS4xMDQtLjAzNC0uMjE2LS4wNTUtLjMyNy0uMDc2bC0yLjQ5NC03LjM4em00Ljk2OCA5LjgyNWEzLjA4MyAzLjA4MyAwIDAgMC0uOTM4LTEuNjY4bDEuNDM4LTIuOTA0IDEuNDUyIDIuOTY3Yy0uNDMuNDMtLjc0My45OC0uODY4IDEuNjA1SDE1LjAxem0tMy40ODEtMS4wOThjLjAzNC0uMDA3LjA2Mi0uMDE0LjA5Ny0uMDJoLjAyYy4wMjktLjAwOC4wNTYtLjAwOC4wODQtLjAxNWguMDI4Yy4wMjggMCAuMDQ5LS4wMDcuMDc2LS4wMDdoLjI3MWMuMDI4IDAgLjA0OS4wMDcuMDcuMDA3LjAxNCAwIC4wMiAwIC4wMzUuMDA3LjAyNy4wMDcuMDQ4LjAwNy4wNzYuMDE0LjAwNyAwIC4wMTQgMCAuMDI4LjAwN2wuMDk3LjAyaC4wMDdjLjAyOC4wMDguMDU2LjAxNS4wODMuMDI5LjAwNyAwIC4wMTQuMDA3LjAyOC4wMDcuMDIxLjAwNy4wNDkuMDE0LjA3LjAyNy4wMDcgMCAuMDE0LjAwNy4wMi4wMDcuMDI4LjAxNC4wNTYuMDIxLjA4NC4wMzVoLjAwN2EuMzc0LjM3NCAwIDAgMSAuMDkuMDQ5aC4wMDdjLjAyOC4wMTQuMDU2LjAzNC4wODQuMDQ4LjAwNyAwIC4wMDcuMDA3LjAxMy4wMDcuMDI4LjAxNC4wNS4wMzUuMDc3LjA0OWwuMDA3LjAwN2MuMDgzLjA2Mi4xNi4xMzIuMjM2LjIwMWwuMDA3LjAwN2ExLjc0NyAxLjc0NyAwIDAgMSAuNDggMS4yMDkgMS43NTIgMS43NTIgMCAwIDEtMy41MDIgMCAxLjc0MiAxLjc0MiAwIDAgMSAxLjMyLTEuNjk1em0tNi44MzgtLjA0OWMuOTY2IDAgMS43NTEuNzg2IDEuNzUxIDEuNzUxcy0uNzg1IDEuNzUxLTEuNzUgMS43NTEtMS43NTItLjc4NS0xLjc1Mi0xLjc1Ljc4Ni0xLjc1MiAxLjc1MS0xLjc1MnptMTYuMTYzIDYuMDI1YTMuMDcgMy4wNyAwIDAgMS0xLjUwOCAyLjEzM2MtLjc1OC40MzgtMS42ODkuNTc3LTIuNjY5LjcxNmExNy4yOSAxNy4yOSAwIDAgMC0xLjY0LjI5MWMtMS40NDUuMzU1LTIuODM0IDEuMDUtNC4xODIgMS43MTctMS43MjQuODU0LTMuMzUgMS42Ni00Ljg1NyAxLjY2YTMuNjQ1IDMuNjQ1IDAgMCAxLTIuMTU0LS42ODhjLTEuNTI5LTEuMDU2LTEuNDUzLTMuMDM2LTEuMjcyLTQuMTIuMTY3LTEuMDE1LjYzMi0xLjk2NiAxLjA3Ny0yLjg3Ny4wMjgtLjA1NS4wNDktLjEwNC4wNzctLjE2LjE1Mi4wNTYuMzEyLjA5OC40NzkuMTI2LS4yNjQgMS40NzMuNDg2IDIuOTk0IDEuOTQ2IDMuNzQ1bC4yNjQuMTM5LjI4NC0uMTA0YzEuMjE2LS40MzEgMi4zNDItMS4xMzMgMy4zMzYtMi4wNzFhOS4zMzQgOS4zMzQgMCAwIDAgMS40NDUtMS43MTZjLjE2LjAyNy4zMi4wMzQuNDguMDM0YTMuMTE3IDMuMTE3IDAgMCAwIDMuMDA4LTIuMzI3aDEuMTY3YTMuMTA5IDMuMTA5IDAgMCAwIDMuMDEgMi4zMjdjLjU3NiAwIDEuMTEtLjE2IDEuNTctLjQzLjE4LjUyLjIzNiAxLjA2My4xMzkgMS42MDV6Ii8+PC9zdmc+"/><text aria-hidden="true" x="605" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">jest coverage</text><text x="605" y="140" transform="scale(.1)" fill="#fff" textLength="750">jest coverage</text><text aria-hidden="true" x="1275" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="430">${result}%</text><text x="1275" y="140" transform="scale(.1)" fill="#fff" textLength="430">${result}%</text></g></svg>`,
    );

    process.exit(0);
  }
});

rl.on("close", () => {
  console.log(`

${script} report:  

  line with stats not found
  
`);

  process.exit(1);
});

var matchOperatorsRe = /[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g;

function pregQuote(str) {
  if (typeof str !== "string") {
    return false;
  }

  return str.replace(matchOperatorsRe, "\\$&");
}

function trim(string, charlist, direction) {
  if (typeof string !== "string") {
    return false;
  }

  direction = direction || "rl";
  charlist = pregQuote(charlist || "");
  charlist = charlist || " \\n";
  direction.indexOf("r") + 1 && (string = string.replace(new RegExp("^(.*?)[" + charlist + "]*$", "gm"), "$1"));
  direction.indexOf("l") + 1 && (string = string.replace(new RegExp("^[" + charlist + "]*(.*)$", "gm"), "$1"));
  return string;
}
