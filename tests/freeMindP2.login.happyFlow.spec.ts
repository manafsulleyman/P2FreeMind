import { test } from "@playwright/test";
import { testData } from "./testData";
import { baseUrl } from "./test-environment";
import { interceptRoute, assestEndPoint } from "./utils";
test("Verifiy that a user is able to login successfully", async ({ page }) => {
  // intercept the assest endpoint
  await interceptRoute(page, assestEndPoint, "POST");

  await page.goto(baseUrl.url);
  await page.getByPlaceholder("Email address").fill(testData.email);
  await page.getByPlaceholder("Password").fill(testData.password);

  // Click the "Continue" button and wait for the API response
  const [response] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url() === assestEndPoint && response.status() === 200
    ),
    page.getByRole("button", { name: "Continue" }).click(),
  ]);
});
