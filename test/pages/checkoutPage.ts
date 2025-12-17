import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";
import { Cart } from "../components/checkout/cart";
import { t } from "../i18n/t";
import { BillingAddress } from "../components/checkout/billingAddress";
import { Payment } from "../components/checkout/payment";
import { SignIn } from "../components/checkout/signIn";

export class CheckoutPage extends ToolShopPage {

  readonly cart: Cart
  readonly signIn: SignIn
  readonly billingAddress: BillingAddress
  readonly payment: Payment

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}/checkout`)

    // Each of these locators are not ideal. The UX structures this form as a 4 step process, so we want to match that in our UI test structure
    // However, the UI implementation uses a single component, without any clear selectors on divs to differentiate between steps
    // Ideally we would use selectors to separate out the steps, rather than these hacks
    this.cart = new Cart(this.page.locator('app-cart'))
    this.signIn = new SignIn(this.page.locator('div'))
      // ↑ This is the hackiest of all(!). But it doesn't matter what element we select, since every locator on this object falls back to using host.page().
    this.billingAddress = new BillingAddress(this.page.locator('[formgroupname="address"]'))
    this.payment = new Payment(
      this.page.locator('div', {
        has: page.locator('h3', { hasText: t('pages:checkout:payment:title') })
      }))
  }
}
