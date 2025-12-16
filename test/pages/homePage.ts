
import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";
import { ProductCard } from "../components/homepage/productCard";

export class HomePage extends ToolShopPage {

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}`)
  }

  async getAllVisibleProducts(): Promise<ProductCard[]> {
    const elements = await this.page
      .locator('[data-test^="product-"]')
      .all();

    const products = await Promise.all(
      elements.map(async (el) => {
        const dataTest = await el.getAttribute("data-test");
        if (!dataTest) {
          throw new Error("Product card missing data-test attribute");
        }

        const productId = dataTest.replace("product-", "");
        return new ProductCard(el, productId);
      })
    );

    return products;
  }

}