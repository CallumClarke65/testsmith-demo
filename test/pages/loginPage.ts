import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";

export class LoginPage extends ToolShopPage {

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}/auth/login`)
  }

  readonly emailInput = this.page.locator('#email')
  readonly passwordInput = this.page.locator('#password')
  readonly submit = this.page.locator('[data-test="login-submit"]')
  readonly loginError = this.page.locator('[data-test="login-error"]')
}