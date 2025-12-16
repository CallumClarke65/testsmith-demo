import { type Page } from '@playwright/test';

export class PageBase {
  constructor(readonly page: Page, readonly url: string) {
    this.page.removeAllListeners('load')
    this.page.on('load', async () => {
      const newUrl = this.page.url();
      console.log(`Page loaded: ${newUrl}`);
    });
  }

  async goto() {
    await this.page.goto(this.url, {
      waitUntil: 'networkidle'
    })
  }
}