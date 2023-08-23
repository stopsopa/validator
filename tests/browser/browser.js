// const { test, expect } = require("@playwright/test");
import { test, expect } from "@playwright/test";

/**
 * https://github.com/jasmine/jasmine/blob/c16974b091bd289c44f93c851062dbb4bdd7ada2/spec/core/integration/AsymmetricEqualityTestersSpec.js#L38
 */
test("runner", async ({ page }) => {
  await page.goto(`/tests/browser/index.html`, { waitUntil: "networkidle0" });
  // networkidle0 - to wait for all traffic to stop

  await page.locator("h1");

  const result = await page.evaluate(async () => {
    return await window.ready;
  });

  console.log("tests/browser/browser.js result: ", JSON.stringify(result, null, 4));

  expect(result).toEqual({
    flat: {
      name: "This value should not be blank.",
      surname: "This value is too short. It should have 10 characters or more.",
      email: "This value is not a valid email address.",
      terms: "This value should be true.",
      "comments.1.comment": "This value is too short. It should have 10 characters or more.",
    },
    tree: {
      name: "This value should not be blank.",
      surname: "This value is too short. It should have 10 characters or more.",
      email: "This value is not a valid email address.",
      terms: "This value should be true.",
      comments: {
        1: {
          comment: "This value is too short. It should have 10 characters or more.",
        },
      },
    },
  });
});
