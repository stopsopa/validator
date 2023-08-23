const th = (msg) => new Error(`jest.config.js error: ${msg}`);

let testRegex; // https://jestjs.io/docs/27.x/configuration#testregex-string--arraystring

const possibleTestRegex = {
  // int: "[^/]+\\.int\\.(m|c)?js$",
  unit: "[^/]+\\.unit\\.(m|c)?js$",
  // both: "[^/]+\\.(unit|int)\\.(m|c)?js$",
};

/**
 * This is to allow
 *    type=int /bin/bash jest.sh
 * (type is lowercase)
 * but I will not document this (it would generate documentation noise), you have to find it here
 */
if (typeof process.env.type === "string" && typeof process.env.TYPE !== "string") {
  process.env.TYPE = process.env.type;
}

if (typeof process.env.TYPE === "string") {
  testRegex = possibleTestRegex[process.env.TYPE];

  if (typeof testRegex !== "string") {
    throw th(`process.env.TYPE must match to one of ${Object.keys(possibleTestRegex).join(", ")}`);
  }
} else {
  /**
   * Filter out arguments specified in jest.sh
   */
  const argv = process.argv.filter((e) => e !== "--runInBand");

  if (argv.length === 2) {
    console.log(`
    
Error:
    ERROR MESSAGE COPIED FROM icare project - might need to be reviewed
  
    you have to specify TYPE=int|unit env var like:

      TYPE=unit /bin/bash jest.sh
        to run unit tests (will run all test files matching to regex ${possibleTestRegex.unit} found anywhere in the project - including 'src' or 'app' etc) 

      TYPE=int /bin/bash jest.sh
        to run integration tests (will run all test files matching to regex ${possibleTestRegex.int} found anywhere) 

    or specify any argument to jest testing library

      /bin/bash jest.sh tests/unit/unit.unit.js
        (in this case your choice will be limited to all test files matching to regex ${possibleTestRegex.both} found anywhere) 
    
    `);

    process.exit(1);
  }

  // testRegex = possibleTestRegex.both;
  testRegex = possibleTestRegex.unit;
}

console.log(`


      NOTICE: currently jest will match only files ${testRegex}


`);

module.exports = async () => {
  return {
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    bail: true,
    testRegex,
    coverageReporters: ["html", "text"],
    collectCoverageFrom: ["validator/**/*.{js,jsx}"],
    snapshotResolver: "./jest.snapshotResolver.js",
    watchPathIgnorePatterns: [".snap.js$"],
  };
};
