import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";
import { CartItem } from "../components/checkout/cartItem";

export class CheckoutPage extends ToolShopPage {

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}/checkout`)
  }

  private readonly appCart = this.page.locator('app-cart')
  readonly cartTotal = this.page.locator('[data-test="cart-total"]')

  async cartItems(): Promise<CartItem[]> {
    // This is probably the worst case of missing selectors. Each tr should have a unique identifier based on the product id- it wouldn't be hard to add that!
    const elements = await this.appCart
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