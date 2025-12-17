import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";

export class AccountPage extends ToolShopPage {

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}/account`)
  }

  readonly emailInput = this.page.locator('#email')
  readonly passwordInput = this.page.locator('#password')
  readonly submit = this.page.locator('[data-test="login-submit"]')
}