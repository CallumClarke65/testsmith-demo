import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";
import { CartItem } from "./cart/cartItem";
import { t } from "../../i18n/t";

export class Cart extends ComponentBase {
    constructor(readonly host: Locator) {
        super(host)
    }

    readonly cartTotal = this.host.locator('[data-test="cart-total"]')
    readonly noItemsMessage = this.host.getByText(t('pages:checkout:cart:empty'))

    async cartItems(): Promise<CartItem[]> {
    // This is probably the worst case of missing selectors. Each tr should have a unique identifier based on the product id- it wouldn't be hard to add that!
    const elements = await this.host
      .locator('tbody > tr')
      .all()

    const cartItems = await Promise.all(
      elements.map(async (el) => {
        if (el.locator('[data-test="product-title"]')) {
          return new CartItem(el);
        }
        // Else we're parsing through the cart total row
      })
    );
    return cartItems;
  }
}