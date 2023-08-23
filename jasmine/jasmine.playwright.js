// const { test, expect } = require("@playwright/test");
import { test, expect } from "@playwright/test";

/**
 * https://github.com/jasmine/jasmine/blob/c16974b091bd289c44f93c851062dbb4bdd7ada2/spec/core/integration/AsymmetricEqualityTestersSpec.js#L38
 */
test("runner", async ({ page }) => {
  await page.goto(`/`, { waitUntil: "networkidle0" });
  // networkidle0 - to wait for all traffic to stop

  await page.locator(".jasmine-seed-bar");

  const result = await page.evaluate(async () => {
    return await window.jasmineFinished;
  });

  const expected = {};

  const stats = {
    passed: 0,
    all: 0,
  };

  const received = result.details.reduce((acc, s) => {
    const { id, parentSuiteId, fullName, status } = s;

    const key = `${parentSuiteId}_${id}`;

    acc[key] = {
      status,
      fullName,
    };

    expected[key] = {
      status: "passed",
      fullName,
    };

    if (status === "passed") {
      stats.passed += 1;
    }

    stats.all += 1;

    return acc;
  }, {});

  console.log("jasmine.playwright.js result: ", JSON.stringify(result, null, 4));

  expect({
    data: received,
    passed: stats.passed,
  }).toEqual({
    data: expected,
    passed: stats.all,
  });
});
