import { Page } from "@playwright/test";
import { ToolShopPage } from "./pageBase";
import { ProductCard } from "../components/home/productCard";
import { PaginationControls } from "../components/home/paginationControls";
import { FilterControls } from "../components/home/filterControls";

export class HomePage extends ToolShopPage {

  readonly paginationControls: PaginationControls
  readonly filters: FilterControls

  readonly noResults = this.page.locator('[data-test="no-results"]')

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL}`)
    this.paginationControls = new PaginationControls(this.page.locator('app-pagination'))
    this.filters = new FilterControls(this.page.locator('#filters'))
  }

  async getAllVisibleProducts(): Promise<ProductCard[]> {
    const elements = await this.page
      .locator('a[data-test^="product-"]')
      .all()
    const visibleElements = elements.filter((l) => l.isVisible())

    const products = await Promise.all(
      visibleElements.map(async (el) => {
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