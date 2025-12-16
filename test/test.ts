import { test as base, Page } from '@playwright/test'
import { TestUsers } from './testUsers';
import { createI18nFixture } from "playwright-i18next-fixture";
import en from './i18n/resources/en.json'
import { setLocale } from './i18n/t';

const i18n = createI18nFixture({
  // i18n configuration options
  options: {
    debug: false,
    ns: ['translations'],
    supportedLngs: ['en'],
    cleanCode: true,
    resources: {
      en: en,
    }
  },
  cache: true,
  auto: true
});

const baseWithi18n = base.extend(i18n)

// Base test object used by all tests
export const test = baseWithi18n.extend<{
  testUsers: TestUsers,
  locale: 'en',
  page: Page,
}>({
  testUsers: async ({}, use) => {
    const testUsers = new TestUsers();
    await use(testUsers);
  },
  page: async ({ page, locale }, use) => {
    setLocale(locale);
    await use(page);
  },
})

