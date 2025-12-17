import { chromium } from "@playwright/test";
import { TestUser } from "./playwright/testUser";
import { TestUsers } from "./testUsers";
import { LoginSteps } from "./steps/loginSteps";

async function globalSetup() {

  // Pre-authenticate users so that we don't have to waste time re-authenticating during tests
  const testUsers = new TestUsers()
  for (const [key, user] of Object.entries(testUsers)) {
    if(!(user instanceof TestUser)) {
      console.warn(`TestUser not defined for this test run- ${key}`)
      continue;
    }

    const browser = await chromium.launch();
    const context = await browser.newContext({
      ignoreHTTPSErrors: process.env.ENVIRONMENT?.startsWith("local")
    });
    const page = await context.newPage();  
    const loginSteps = new LoginSteps(page)

    await loginSteps.preAuthUser(user)
  }
}

export default globalSetup;