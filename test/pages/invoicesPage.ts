import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";
import { InvoiceRow } from "../components/invoices/invoiceRow";

export class InvoicesPage extends ToolShopPage {

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}/account/invoices`)
  }

  async invoiceRows(): Promise<InvoiceRow[]> {
    const elements = await this.page
      .locator('tbody > tr') // Bad selector. Instead each tr should have a data-test attribute with the invoice ID
      .all()

    const rows = await Promise.all(
      elements.map(async (el) => {
        // Again, if each tr had the invoice ID, we could make a better selector here
        return new InvoiceRow(el);
      })
    );

    return rows;
  }
}