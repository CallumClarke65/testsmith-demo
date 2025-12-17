import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";

export class InvoiceDetailsPage extends ToolShopPage {

  constructor(page: Page, id: string) {
    super(page, `${process.env.BASE_URL}/account/invoices/${id}`)
  }

  readonly number = this.page.locator('[data-test="invoice-number"]')
  readonly date = this.page.locator('[data-test="invoice-date"]')
  readonly total = this.page.locator('[data-test="total"]')
  readonly street = this.page.locator('[data-test="street"]')
}