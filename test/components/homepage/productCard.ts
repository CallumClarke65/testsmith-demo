import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";
import { ProductDetailPage } from "../../pages/productDetailPage";

export class ProductCard extends ComponentBase {

    constructor(readonly host: Locator, readonly id: string) {
        super(host)
    }

    readonly img = this.host.locator('img')
    readonly name = this.host.locator('[data-test="product-name"]')
    readonly price = this.host.locator('[data-test="product-price"]')
    private readonly co2RatingBadge = this.host.locator('[data-test="co2-rating-badge"]')

    async getCO2Rating(): Promise<string> {
        const letters = await this.co2RatingBadge.locator('span').all()
        const active = letters.find( async (l) => {
            return (await l.getAttribute('class')).includes('active')
        })
        return active.textContent()
    }

    async viewDetail(): Promise<ProductDetailPage> {
        await this.host.click()
        await this.host.page().waitForLoadState("networkidle")
        return new ProductDetailPage(this.host.page(), this.id)
    }
}