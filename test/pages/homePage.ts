import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";
import { ProductCard } from "../components/homepage/productCard";
import { PaginationControls } from "../components/homepage/paginationControls";

export class HomePage extends ToolShopPage {

  readonly paginationControls: PaginationControls
  readonly searchInput = this.page.locator('#search-query')
  readonly searchSubmit = this.page.locator('[data-test="search-submit"]')
  readonly noResults = this.page.locator('[data-test="no-results"]')

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}`)
    this.paginationControls = new PaginationControls(this.page.locator('app-pagination'))
  }

  async getAllVisibleProducts(): Promise<ProductCard[]> {
    const elements = await this.page
      .locator('a[data-test^="product-"]')
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