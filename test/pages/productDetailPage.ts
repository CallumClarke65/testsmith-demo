import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";

export class ProductDetailPage extends ToolShopPage {

  constructor(page: Page, productId: string) {
    super(page, `${process.env.BASE_URL}/product/${productId}`)
  }

  readonly productImage = this.page.locator('img[class*=figure]') // This is properly hacky, but there isn't a good selector
  readonly price = this.page.locator('[data-test="unit-price"]')
  readonly name = this.page.locator('[data-test="product-name"]')
  readonly description = this.page.locator('[data-test="product-description"]')
  private readonly addToCartButton = this.page.locator('[data-test="add-to-cart"]')
  private readonly addedToCartConfirmation = this.page.getByText('Product added to shopping cart.') // This text doesn't appear to be localised.

  async addToCart() {
    await this.addToCartButton.click()
    await this.addedToCartConfirmation.waitFor()
  }
}