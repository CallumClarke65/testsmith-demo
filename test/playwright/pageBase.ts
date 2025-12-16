import { type Page } from '@playwright/test';

export class PageBase {
  constructor(readonly page: Page) {

    this.page.removeAllListeners('load')
    this.page.on('load', async () => {
      const newUrl = this.page.url();
      console.log(`Page loaded: ${newUrl}`);
    });
  }
}