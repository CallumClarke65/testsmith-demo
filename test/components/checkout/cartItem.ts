import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";

export class CartItem extends ComponentBase {
    constructor(readonly host: Locator) {
        super(host)
    }

    readonly title = this.host.locator('[data-test="product-title"]')
    readonly quantity = this.host.locator('[data-test="product-quantity"]')
    readonly price = this.host.locator('[data-test="product-price"]')
    readonly total = this.host.locator('[data-test="line-price"]')
}