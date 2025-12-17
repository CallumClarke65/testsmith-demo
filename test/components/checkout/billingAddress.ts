import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";

export class BillingAddress extends ComponentBase {
    constructor(readonly host: Locator) {
        super(host)
    }

    readonly street = this.host.locator('[data-test="street"]')
    readonly city = this.host.locator('[data-test="city"]')
    readonly state = this.host.locator('[data-test="state"]')
    readonly country = this.host.locator('[data-test="country"]')
    readonly postalCode = this.host.locator('[data-test="postal_code"]')

    readonly next = this.host.page().locator('[data-test="proceed-3"]')
}