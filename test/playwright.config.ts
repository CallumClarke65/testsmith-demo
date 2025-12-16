import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Suppress dotenv verbose logging
process.env.DOTENV_CONFIG_QUIET = "true"

// Read the appropriate env file
if(process.env.ENVIRONMENT !== undefined) {
  dotenv.config({path: `./settings/${process.env.ENVIRONMENT}.env`});
} else {
  throw new Error('Config not loaded. Environment not defined');
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalSetup: './globalSetup',
  globalTeardown: './globalTeardown',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 4,
  reporter: [
    ['junit', { outputFile: 'test-results/playwright-results.xml' }],
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    screenshot: 'off',
    trace: 'on-first-retry',
  },
  timeout: 240000, // 4 minutes. LONG. Ideally we want any failure messages to be locator timeouts, not test timeouts

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 1920,
          height: 1080
        },
        actionTimeout: 30000, // Max 30s timeout for any single action
      },
    }
  ],
});
