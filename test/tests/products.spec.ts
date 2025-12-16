import { expect } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { test } from "../test";

test.describe(`View Product List`, () => {

    test("Homepage displays a list of products with names, images, and prices", async ({ page }) => {

        const homePage = new HomePage(page);

        // Arrange / Act
        const productListFromApi: Product[] = await test.step('Navigate to home page', async () => {
            const [response] = await Promise.all([
                page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products`) &&
                    resp.status() === 200
                ),
                homePage.goto(),
            ]);

            return (await response.json()).data as Product[];
        });

        // Assert
        const productsDisplayed = await test.step('Retrieve displayed products', async () => {
            return await homePage.getAllVisibleProducts()
        })

        await test.step('Verify products are correctly displayed', async () => {
            for (const pApi of productListFromApi) {
                await test.step(`Verify product ${pApi.id} is correctly displayed`, async () => {
                    const productCard = productsDisplayed.find((pUi) => pApi.id === pUi.id)
                    if (!productCard) {
                        throw new Error(`Product ${pApi.id} not found in UI`)
                    }

                    await productCard.host.scrollIntoViewIfNeeded()

                    await expect(productCard.img).toBeVisible()
                    await expect(productCard.img).toHaveAttribute("alt", pApi.name, { ignoreCase: true })
                    await expect(productCard.name).toHaveText(pApi.name, { ignoreCase: true })
                    await expect(productCard.price).toContainText(String(pApi.price))
                });
            }
        })
    })

    test("Can follow product links to a detailed product page", async ({ page }) => {

    })

    test("User can interact with pagination controls to view all products", async ({ page }) => {

    })

})

test.describe(`View Product Details`, () => {
    test("Product details page displays name, description, price, and image", async ({ page }) => {

    })

    test("Can add to cart as a visitor", async ({ page }) => {

    })
})

test.describe(`Search for product`, () => {
    test("Can successfully search for a valid product", async ({ page }) => {

    })

    test("Informative message shown when there are no valid products", async ({ page }) => {

    })
})

test.describe(`Filtering products`, () => {
    test("Can successfully apply filters", async ({ page }) => {

    })

    test("Can clear filters to return to the full list of products", async ({ page }) => {

    })
})
