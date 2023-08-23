/**
 * logic based on:  https://jasmine.github.io/tutorials/custom_boot
 *                  https://jasmine.github.io/archives/2.0/boot.html
 *                  http://tutorials.jumpstartlab.com/projects/javascript/testing/1-jasmine-intro.html
 *
 * Jasmine cheatsheet: https://devhints.io/jasmine
 */
// import jasmineRequire from "jasmine-core/lib/jasmine-core/jasmine.js";

// import { stringify } from "yaml";

const jasmine = jasmineRequire.core(jasmineRequire);

window.jasmine = jasmine;

// /**
//  * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
//  */
jasmineRequire.html(jasmine);

var env = jasmine.getEnv();

/**
 * duck punch addReporter method
 *
 * this way I will not need to override jasmine/boot1.js
 * and I will be able to just leave original boot1.js in jasmine/test.html
 */

const jasmineReporterPromise = new Promise((resolve) => {
  window.jasmineReporterPromiseResolve = resolve;
});
const jasmineExecutePromise = new Promise((resolve) => {
  window.jasmineExecutePromiseResolve = resolve;
});
const jasmineFinished = new Promise((resolve) => {
  window.jasmineFinishedResolve = resolve;
});

window.jasmineFinished = jasmineFinished;

const registeredReporters = [];

{
  const originaladdReporter = env.addReporter;

  // Override the addReporter method to capture registered reporters
  env.addReporter = function (reporter) {
    registeredReporters.push(reporter);
    return originaladdReporter.call(this, reporter);
  };
}

{
  const originalExecute = env.execute;

  // Override the addReporter method to capture registered reporters
  env.execute = function (...args) {
    const promise = originalExecute.call(this, ...args);
    window.jasmineExecutePromiseResolve(promise);
    return promise;
  };
}

const suites = {};

// /**
//  * no need for this
//  * https://github.com/jasmine/jasmine/blob/v5.1.0/spec/core/integration/DefaultSpyStrategySpec.js#L90C5-L92C8
//  */
env.addReporter({
  jasmineDone: function () {
    // <---- this one seems to be fired last
    // console.log("jasmineDone", ...args);

    // console.log("Registered Reporters 1:", registeredReporters);

    // Now you can access the registered reporters

    const reportersMapped = registeredReporters.reduce((acc, reporter, index) => {
      let name = String(index);
      try {
        const tmp = reporter.constructor.name;

        if (typeof tmp === "string" && tmp.trim() && tmp !== "Object" && !acc[tmp]) {
          name = tmp;
        }
      } catch (e) {
        console.log(`repacking registeredReporters error on index >${index}<`, e);
      }

      acc[name] = reporter;

      return acc;
    }, {});

    window.reportersMapped = reportersMapped;

    // console.log("Registered Reporters:", reportersMapped, reportersMapped.JsApiReporter);

    window.jasmineReporterPromiseResolve({
      JsApiReporter: reportersMapped.JsApiReporter,
      HtmlReporter: reportersMapped.HtmlReporter,
      suites,
    });
  },
  // jasmineStarted: function (...args) {
  //   console.log("jasmineStarted", ...args);
  // },
  suiteStarted: function (suite) {
    // console.log("suiteStarted", suite);

    const { id, ...rest } = suite;

    suites[id] = rest;
  },
  // specStarted: function (...args) {
  //   console.log("specStarted", ...args);
  // },
  // specDone: function (...args) {
  //   console.log("specDone", ...args);
  // },
  // suiteDone: function (...args) {
  //   console.log("suiteDone", ...args);
  // },
});

/**
 * testing custom reporter, I'm not gonna use it at the end
 */
// {
//   const myReporter = {
//     // https://jasmine.github.io/tutorials/custom_reporter
//     jasmineStarted: function (suiteInfo) {
//       console.log("Running suite with " + suiteInfo.totalSpecsDefined);
//     },

//     suiteStarted: function (result) {
//       console.log("Suite started: " + result.description + " whose full description is: " + result.fullName);
//     },

//     specStarted: async function (result) {
//       // await somethingAsync();
//       console.log("Spec started: " + result.description + " whose full description is: " + result.fullName);
//     },

//     specDone: function (result) {
//       console.log("Spec: " + result.description + " was " + result.status);

//       for (const expectation of result.failedExpectations) {
//         console.log("Failure: " + expectation.message);
//         console.log(expectation.stack);
//       }

//       console.log(result.passedExpectations.length);
//     },

//     suiteDone: function (result) {
//       console.log("Suite: " + result.description + " was " + result.status);
//       for (const expectation of result.failedExpectations) {
//         console.log("Suite " + expectation.message);
//         console.log(expectation.stack);
//       }
//     },

//     jasmineDone: function (result) {
//       console.log("Finished suite: " + result.overallStatus);
//       for (const expectation of result.failedExpectations) {
//         console.log("Global " + expectation.message);
//         console.log(expectation.stack);
//       }
//     },
//   };

//   env.addReporter(myReporter);
// }

/**
 * All below will be configured automatically the way it is done in the library itself in:
 * <script src="./bundles/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>
 */
// // {
// //   // var queryString = new jasmine.QueryString({
// //   //     getWindowLocation: function () {
// //   //         return window.location;
// //   //     }
// //   // });

// //   var htmlReporter = new jasmineRequire.HtmlReporter({
// //     env: env,
// //     navigateWithNewParam: function (key, value) {
// //       log("navigateWithNewParam");
// //       // return queryString.navigateWithNewParam(key, value);
// //     },
// //     addToExistingQueryString: function (key, value) {
// //       log("addToExistingQueryString");
// //       // return queryString.fullStringWithNewParam(key, value);
// //     },
// //     getContainer: function () {
// //       log("getContainer");
// //       return document.body;
// //     },
// //     createElement: function () {
// //       log("createElement");
// //       return document.createElement.apply(document, arguments);
// //     },
// //     createTextNode: function () {
// //       log("createTextNode");
// //       return document.createTextNode.apply(document, arguments);
// //     },
// //     timer: new jasmine.Timer(),
// //     filterSpecs: false,
// //     // filterSpecs: filterSpecs
// //   });
// //   env.addReporter(htmlReporter);
// // }

window.env = env;

const jasmineInterface = jasmineRequire.interface(jasmine, env);

jasmineInterface.test = jasmineInterface.it;

jasmineInterface.after = jasmineInterface.afterEach;

jasmineInterface.before = jasmineInterface.beforeEach;

jasmineInterface.context = jasmineInterface.describe;

window.jasmineInterface = jasmineInterface;

Object.assign(window, jasmineInterface);

/**
 * First idea to get the result without overriding boot1.js
 * Which would work too I guess ...
 */
// env.afterAll(() => {
//   console.log("all done", document.documentElement.innerHTML.split("<").join("\n<"));
//   setTimeout(() => {
//     console.log("all done", document.documentElement.innerHTML.split("<").join("\n<"));
//   }, 50);
// });

/**
 * some inline tests - you know, for testing...
 */
// describe("abc", () => {
//   it("all good", (done) => {
//     setTimeout(() => {
//       const test = 'test';

//       console.log('my test')

//       expect(test).toEqual('testh')

//       done();
//       // done("boom");
//     }, 2000);
//   });
//   it("all good2", (done) => {
//     setTimeout(() => {
//       const test = 'test';

//       console.log('my test')

//       expect(test).toEqual('testdh')

//       done();
//       // done("boom");
//     }, 3000);
//   });
// });

// window.t = (async function () {
//   var t;
//   try {
//     t = await env.execute();
//   } catch (e) {
//     console.log("error: ", e);
//   }

//   console.log("t: ", t);
// })();

/**
 * This is plan "B" if duck punching fails
 * https://github.com/jasmine/jasmine/blob/v5.1.0/spec/core/JsApiReporterSpec.js#L21C14-L21C25
 */

(async function () {
  try {
    const { JsApiReporter, HtmlReporter, suites } = await jasmineReporterPromise;

    const execute = await jasmineExecutePromise;

    // console.log("suites: ", suites);

    const result = await execute;

    window.execute = execute;

    const dump = {
      execute,
      result,
      overallStatus: result.overallStatus, // passed || failed
      passed: result.overallStatus === "passed",
      failed: result.overallStatus === "failed",
      js: {
        // https://jasmine.github.io/api/edge/jsApiReporter.html
        executionTime: JsApiReporter.executionTime(),
        specs: JsApiReporter.specs(),
        status: JsApiReporter.status(),
        suites: JsApiReporter.suites(),
      },
    };

    // console.log("dump", dump);

    /**
     * Let's do some reduction of noise
     */
    const details = JsApiReporter.specs().map((m) => {
      const t = structuredClone(m);

      try {
        t.failedExpectations = t.failedExpectations.map((s) => {
          try {
            if (typeof s.stack === "string") {
              s.stack = s.stack.split("\n");
            }
          } catch (e) {}
          return s;
        });
        if (!Array.isArray(t.failedExpectations) || t.failedExpectations.length === 0) {
          delete t.failedExpectations;
        }
        if (!Array.isArray(t.passedExpectations) || t.passedExpectations.length === 0) {
          delete t.passedExpectations;
        }
        if (!Array.isArray(t.deprecationWarnings) || t.deprecationWarnings.length === 0) {
          delete t.deprecationWarnings;
        }
        if (typeof t.pendingReason === "string" && t.pendingReason === "") {
          delete t.pendingReason;
        }
        if (t.properties === null) {
          delete t.properties;
        }
        if (t.debugLogs === null) {
          delete t.debugLogs;
        }
      } catch (e) {}

      return t;
    });

    /**
     * Later do tree structure
     */
    // const leveled = {}

    // for (let suite of spec) {

    //   const {
    //     parentSuiteId, filename, ...s
    //   } = suite;

    //   if (!leveled[parentSuiteId]) {

    //     leveled[parentSuiteId] = {

    //     }
    //   }

    // }

    // console.log("json", stringify(spec));
    // console.log("json", JSON.stringify(spec, null, 4));

    window.jasmineFinishedResolve({
      passed: result.overallStatus === "passed",
      details,
    });

    console.log("json", JSON.stringify(details, null, 8));
  } catch (e) {
    console.error("global jasmineReporterPromise error", e);

    throw e;
  }
})();
