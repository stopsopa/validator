const path = require("path");

const DOT_EXTENSION = ".snap.js";

/**
 * Based on : https://github.com/facebook/jest/blob/50bab21a8e88215061228e4197bfe632a529692c/packages/jest-snapshot/src/SnapshotResolver.ts#L59
 * Explanation: https://stackoverflow.com/a/68445363
 * 
 * in order to use this resolver you have to extend jest.config.js with
 * 
 * module.exports = async () => {
  return {
    .. other config
    snapshotResolver: "./jest.snapshotResolver.js",
    watchPathIgnorePatterns: [".snap.js$"],
  };
};

where watchPathIgnorePatterns is to prevent --watch and --watchAll from looping after every touch to any .snap.js file

 */
const resolver__snapshots__ = {
  resolveSnapshotPath: (testPath) => {
    const dirname = path.dirname(testPath);

    const filename = path.basename(testPath, path.extname(testPath));

    return path.join(dirname, `__snapshots__`, `${filename}${DOT_EXTENSION}`);
  },
  resolveTestPath: (snapshotPath) => {
    let dirname = path.dirname(snapshotPath);

    dirname = path.dirname(dirname);

    let filename = path.basename(snapshotPath, path.extname(snapshotPath));

    filename = path.basename(filename, path.extname(filename));

    return path.join(dirname, `${filename}.js`);
  },

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: "some/__snapshots__/example.test.js",
};

const resolver_just_snap_js = {
  resolveSnapshotPath: (testPath) => {
    const dirname = path.dirname(testPath);

    const filename = path.basename(testPath, path.extname(testPath));

    return path.join(dirname, `${filename}${DOT_EXTENSION}`);
  },
  resolveTestPath: (snapshotPath) => {
    const dirname = path.dirname(snapshotPath);

    let filename = path.basename(snapshotPath, path.extname(snapshotPath));

    filename = path.basename(filename, path.extname(filename));

    return path.join(dirname, `${filename}.js`);
  },

  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: "some/example.test.js",
};

/**
 * You can switch the mode here
 * You can switch the mode here
 * You can switch the mode here
 * You can switch the mode here
 * You can switch the mode here
 * You can switch the mode here
 */
// const resolver = resolver__snapshots__;
const resolver = resolver_just_snap_js;

module.exports = resolver;

if (require.main === module) {
  /**
   * To test:
   *
   * node jest.snapshotResolver.js
   */
  const log = console.log;

  function test(resolver) {
    const encoded = resolver.resolveSnapshotPath(resolver.testPathForConsistencyCheck);

    const decoded = resolver.resolveTestPath(encoded);

    log({
      origina: resolver.testPathForConsistencyCheck,
      encoded,
      decoded,
      equal__: resolver.testPathForConsistencyCheck === decoded,
    });
  }

  test(resolver__snapshots__);
  test(resolver_just_snap_js);
}
