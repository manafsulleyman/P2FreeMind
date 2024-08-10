import { test, expect } from "@playwright/test";
import { testData } from "./testData";
import { login, interceptRoute } from "./utils";
import {
  baseUrl,
  biosketchAbstractApi,
  fileUplaodapi,
} from "./test-environment";

test.describe("Biosketch Generation flow", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testData.email, testData.password);
  });
  test("Verify that a user is able to generate a biosketch successfully with a CV upload", async ({
    page,
  }) => {
    let assestEndPoint = fileUplaodapi.url;
    let assestEndPoint1 = biosketchAbstractApi.url;
    // intercept the assest endpoint
    await interceptRoute(page, assestEndPoint, "POST");

    await page.getByText("Biosketch").click();
    await page.getByRole("button", { name: "New Biosketch" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Select\.\.\.$/ })
      .click();
    await page.getByText("Chief Medical Officer").click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testData.biosketchFile);
    await page.getByText("Add File").click();
    await page.getByRole("button", { name: "Save & Continue" }).click();
    //Soft assertion
    await expect(page).toHaveURL(
      `${baseUrl.url}/biosketch/new-biosketch/step-2`
    );

    // Click the "Skip this step" button and wait for the API response
    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url() === assestEndPoint && response.status() === 200
      ),
      page.getByRole("button", { name: "Skip this step" }).click(),
    ]);

    // Assert the response status
    const responseBody = await response.json();
    expect(responseBody.status).toBe("success");

    //Soft assertion
    await expect(page).toHaveURL(
      `${baseUrl.url}/biosketch/new-biosketch/step-3`
    );

    // Click the "Save & Continue" button and wait for the API response
    const [response1] = await Promise.all([
      page.waitForResponse(
        (response1) =>
          response1.url() === assestEndPoint1 && response1.status() === 200
      ),
      page.getByRole("button", { name: "Save & Continue" }).click(),
    ]);
    // Assert the response status
    const responseBody1 = await response1.json();
    expect(responseBody1.status).toBe("success");
  });
});
