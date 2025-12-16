import { expect, Page } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { test } from "../test";
import { ProductDetailPage } from "../pages/productDetailPage";

test.describe(`View Product List`, () => {

    async function navigateToHomePageAndWaitForProductsApi(homePage: HomePage): Promise<Product[]> {
        const productListFromApi: Product[] = await test.step('Navigate to home page', async () => {
            const [response] = await Promise.all([
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products`) &&
                    resp.status() === 200
                ),
                homePage.goto(),
            ]);

            return (await response.json()).data as Product[];
        });
        return productListFromApi
    }

    test("Homepage displays a list of products with names, images, and prices", async ({ page }) => {
        // Arrange / Act
        const homePage = new HomePage(page)
        const productListFromApi = await navigateToHomePageAndWaitForProductsApi(homePage)

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
                    expect(await productCard.getCO2Rating()).toBe(pApi.co2_rating)
                });
            }
        })
    })

    test("Can follow product links from homepage to a detailed product page", async ({ page }) => {
        // Arrange
        const homePage = new HomePage(page)
        const productListFromApi = await navigateToHomePageAndWaitForProductsApi(homePage)

        // We'll just pick the first one, rather than verifying navigation for every product
        const testProduct = productListFromApi[0]

        // Act
        const productDetailPage = await test.step('Click on a product link', async () => {
            const productsDisplayed = await homePage.getAllVisibleProducts()
            const testProductOnUi = productsDisplayed.find((p) => p.id === testProduct.id)

            return await testProductOnUi.viewDetail()
        })

        // Assert
        await expect(productDetailPage.page).toHaveURL(productDetailPage.url)
    })

    test("User can interact with pagination controls to view the next page of products", async ({ page }) => {
        // Arrange
        const homePage = new HomePage(page)
        await navigateToHomePageAndWaitForProductsApi(homePage)

        // Act
        // HACK - We're assuming that there is always a second page of data. We'd need to maintain a test environment that ensures this is the case.
        const page2productList = await test.step('Navigate to page 2', async () => {
            const [response] = await Promise.all([
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products`) &&
                    resp.status() === 200
                ),
                homePage.paginationControls.next.click()
            ])
            return (await response.json()).data as Product[];
        })

        // Assert

        await test.step('Verify data from page 2 is displayed', async () => {
            // We'll call it quits at verifying that a single product from page 2 has rendered, and with an auto-retrying shortcut
            await page.locator(`[data-test="product-${page2productList[0].id}"]`).waitFor()
        })
    })

    test("User can use pagination to request any given page", async ({ page }) => {
        // Arrange
        const homePage = new HomePage(page)
        await navigateToHomePageAndWaitForProductsApi(homePage)

        // Act
        // HACK - Similar to above test.
        // Additionally, we should really look at the API response to know how many pages of data there are. I'm just hard-coding to look at page 3.
        const page3productList = await test.step('Navigate to page 3', async () => {
            const [response] = await Promise.all([
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products`) &&
                    resp.status() === 200
                ),
                homePage.paginationControls.page(3).click()
            ])
            return (await response.json()).data as Product[];
        })

        // Assert
        await test.step('Verify data from page 3 is displayed', async () => {
            // We'll call it quits at verifying that a single product from page 2 has rendered, and with an auto-retrying shortcut
            await page.locator(`[data-test="product-${page3productList[0].id}"]`).waitFor()
        })
    })

})

test.describe(`View Product Details`, () => {
    // For speed, and since we have another test covering navigation from the homepage, we'll allow direct navigation
    const testProductId = "01KCM8HHVZ2F35JN0D9F3HSWTN"

    test("Product details page displays name, description, price, and image", async ({ page }) => {
        const productDetailPage = new ProductDetailPage(page, testProductId)

        // Arrange / Act
        const testProduct = await test.step('Navigate directly to product details page', async () => {

            const [response] = await Promise.all([
                productDetailPage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products/${testProductId}`) &&
                    resp.status() === 200
                ),
                productDetailPage.goto()
            ])
            return (await response.json()) as Product;

        })

        // Assert
        await test.step('Verify product details are displayed correctly', async () => {
            await expect(productDetailPage.name).toHaveText(testProduct.name)
            await expect(productDetailPage.description).toHaveText(testProduct.description)
            await expect(productDetailPage.price).toContainText(String(testProduct.price))
            await expect(productDetailPage.productImage).toHaveAttribute('alt', testProduct.name)
        })
    })

    test("Can add to cart as a visitor", async ({ page }) => {
        const productDetailPage = new ProductDetailPage(page, testProductId)

        // Arrange
        await test.step('Navigate directly to product details page', async () => {
            await productDetailPage.goto()
        })

        const initialCardQuantity = await test.step('Get initial cart quantity', async () => {
            return await productDetailPage.navBar.getCartQuantity()
        })

        // Act
        await test.step('Add item to cart', async () => {
            await productDetailPage.addToCart()
        })

        // Assert
        await test.step('Verify cart quantity has increased', async () => {
            expect(await productDetailPage.navBar.getCartQuantity()).toBe(initialCardQuantity + 1)
        })
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
