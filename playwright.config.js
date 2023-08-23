// @ts-check
const { devices } = require("@playwright/test");

const th = (msg) => new Error(`playwright.config.js error: ${msg}`);

const protocolRegex = /^https?:\/\//;

require("dotenv").config();

function envcheck(name, ret) {
  if (typeof process.env[name] !== "string") {
    if (ret) return false;

    throw th(`process.env.${name} is not a string`);
  }

  if (!process.env[name].trim()) {
    if (ret) return false;

    throw th(`process.env.${name} is an ampty string`);
  }

  return true;
}

if (envcheck("BASE_URL", true)) {
  console.log(`existing BASE_URL: >${process.env.BASE_URL}<`);
} else {
  envcheck("NODE_API_PROTOCOL");

  envcheck("NODE_API_HOST");

  if (!["http", "https"].includes(process.env.NODE_API_PROTOCOL)) {
    throw th(`process.env.NODE_API_PROTOCOL should be http or https`);
  }

  process.env.BASE_URL = `${process.env.NODE_API_PROTOCOL}://${process.env.NODE_API_HOST}`;

  if (envcheck("NODE_API_PORT", true)) {
    process.env.BASE_URL += `:${process.env.NODE_API_PORT}`;
  }

  console.log(`generated BASE_URL: >${process.env.BASE_URL}<`);
}

envcheck("BASE_URL");

if (!protocolRegex.test(process.env.BASE_URL)) {
  throw th(`process.env.BASE_URL don't match ${protocolRegex}`);
}

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 *
 * Read more: https://playwright.dev/docs/api/class-testconfig
 */
const config = {
  // testDir: "./tests",
  testDir: __dirname,
  testMatch: process.env.PLAYWRIGHT_TEST_MATCH || "**/*.e2e.js", // https://playwright.dev/docs/test-configuration#testing-options
  // testIgnore: [ // https://playwright.dev/docs/api/class-testconfig#test-config-test-ignore
  //   /macro-tests/
  // ],
  snapshotDir: "./var/snapshotDir",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { open: "never" }]], // or CI=1 from: https://github.com/microsoft/playwright/issues/11773#issuecomment-1026742482

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /**
     *
     * https://playwright.dev/docs/api/class-testoptions
     * https://playwright.dev/docs/api/class-testproject
     *
     */

    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    // extraHTTPHeaders: { // from: https://playwright.dev/docs/test-api-testing#configuration
    //   // We set this header per GitHub guidelines.
    //   Accept: "application/vnd.github.v3+json",
    //   // Add authorization token to all requests.
    //   // Assuming personal access token available in the environment.
    //   Authorization: `token ${process.env.API_TOKEN}`,
    // },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    // { // too much problems with running tests - commenting out
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

/**
 * Above just standard default config, and below we will modify it the way we need
 */
const cmd = require("./tests/tools/cmd");

const json = cmd(["node", "playwright-async.config.js"]);

module.exports = config;
