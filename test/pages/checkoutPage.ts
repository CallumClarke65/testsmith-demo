import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";
import { CartItem } from "../components/checkout/cart/cartItem";
import { Cart } from "../components/checkout/cart";

export class CheckoutPage extends ToolShopPage {

  readonly cart: Cart

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}/checkout`)
    this.cart = new Cart(this.page.locator('app-cart'))
  }
  
}