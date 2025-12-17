import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";

export class Payment extends ComponentBase {
    constructor(readonly host: Locator) {
        super(host)
    }

    // For brevity, we're only going to support credit card payment methods
    readonly method = this.host.locator('[data-test="payment-method"]')
    readonly ccNumber = this.host.locator('#credit_card_number')
    readonly ccExpiry = this.host.locator('#expiration_date')
    readonly ccCCV = this.host.locator('#cvv')
    readonly ccName = this.host.locator('#card_holder_name')

    readonly confirm = this.host.page().locator('[data-test="finish"]')
    readonly success = this.host.page().locator('[data-test="payment-success-message"]')
    readonly error = this.host.page().locator('[data-test="payment-error-message"]')
}