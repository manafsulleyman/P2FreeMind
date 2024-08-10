import { Page, expect } from "@playwright/test";
import { baseUrl, apiUrl } from "./test-environment";

export async function login(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  // intercept the assest endpoint
  await interceptRoute(page, assestEndPoint, "POST");
  await page.goto(baseUrl.url);
  await page.getByPlaceholder("Email address").fill(email);
  await page.getByPlaceholder("Password").fill(password);

  // Click the "Continue" button and wait for the API response
  const [response] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url() === assestEndPoint && response.status() === 200
    ),
    page.getByRole("button", { name: "Continue" }).click(),
  ]);
}

export async function interceptRoute(page: Page, url: string, method: string) {
  await page.route(url, (route) => {
    const request = route.request();
    expect(request.method()).toBe(method); // Assert the request method
    route.continue(); // Continue the request
  });
}

export const assestEndPoint = apiUrl.url;
