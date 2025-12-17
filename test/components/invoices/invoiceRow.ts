import { InvoiceDetailsPage } from "../../pages/invoiceDetailsPage";
import { ComponentBase } from "../../playwright/componentBase";

export class InvoiceRow extends ComponentBase {
    // The nightmare continues! We're not putting good selectors on any of the <td>s, so we'll just hack it based on order
    readonly number = this.host.locator('td').nth(0)
    readonly address = this.host.locator('td').nth(1)
    readonly date = this.host.locator('td').nth(2)
    readonly total = this.host.locator('td').nth(3)

    async viewDetails(): Promise<InvoiceDetailsPage> {
        const button = this.host.locator('a')
        const id = (await button.getAttribute('href')).split('/').pop()

        await button.click()
        await this.host.page().waitForLoadState("networkidle")
        return new InvoiceDetailsPage(this.host.page(), id)
    } 
}
