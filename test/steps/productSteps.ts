import { step as baseStep } from "../playwright/decorators"
import { Page } from "@playwright/test";
import { HomePage } from "../pages/homePage";

const step = baseStep('products')

export class ProductSteps {

    private readonly homePage: HomePage

    constructor(private readonly page: Page) {
        this.homePage = new HomePage(page)
    }

    @step
    async addProductToCartByName(productName: string): Promise<Product> {
        if (this.page.url() != this.homePage.url) {
            await this.homePage.goto()
        }
        await this.homePage.filters.searchInput.fill(productName)
        await this.homePage.filters.searchSubmit.click()
        await this.page.waitForTimeout(1000) // HACK - Need to wait for search to complete AND ui to update
        const products = await this.homePage.getAllVisibleProducts()

        const productCard = await (async () => {
            for (const p of products) {
                const name = await p.name.textContent()
                if (name?.trim() === productName) {
                    return p
                }
            }
            return undefined
        })()

        if (!productCard) {
            throw new Error(`Product "${productName}" not found`)
        }

        const [productDetailPage, response] = await Promise.all([
            productCard.viewDetail(),
            this.page.waitForResponse(resp =>
                resp.url().includes(`${process.env.API_BASE_URL}/products`) &&
                resp.status() === 200
            ),
        ])

        await productDetailPage.addToCart()

        // Not sure what happens to make this necessary. Sometimes the test intercepts an API response with an array, sometimes it doesn't.
        // Either way, this hack will fix it quickly.
        const responseJson = await response.json()
        if(responseJson.data) {
            return responseJson.data.find((p) => p.name === productName) as Product
        }
        if (Array.isArray(responseJson)) {
            return responseJson.find((p) => p.name === productName) as Product
        }
        return responseJson as Product
    }
}