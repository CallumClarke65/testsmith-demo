import { expect, Page } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { test } from "../test";
import { ProductDetailPage } from "../pages/productDetailPage";

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

test.describe(`View Product List`, () => {

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
    // For speed, and since we have another test covering navigation from the homepage, we'll should use direct navigation
    // However, the product ids supplied by the hosted website are regularly changing
    // 

    test("Product details page displays name, description, price, and image", async ({ page }) => {
        // Arrange / Act
        const homePage = new HomePage(page)
        const productListFromApi = await navigateToHomePageAndWaitForProductsApi(homePage)
        const testProduct = productListFromApi[0]

        const productDetailPage = await test.step('Click on a product link', async () => {
            const productsDisplayed = await homePage.getAllVisibleProducts()
            const testProductOnUi = productsDisplayed.find((p) => p.id === testProduct.id)

            return await testProductOnUi.viewDetail()
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

        // Arrange
        const homePage = new HomePage(page)
        const productListFromApi = await navigateToHomePageAndWaitForProductsApi(homePage)
        const testProduct = productListFromApi[0]

        const productDetailPage = await test.step('Click on a product link', async () => {
            const productsDisplayed = await homePage.getAllVisibleProducts()
            const testProductOnUi = productsDisplayed.find((p) => p.id === testProduct.id)

            return await testProductOnUi.viewDetail()
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

    test.use({
        i18n: async ({ i18n }, use) => {
            await i18n.changeLanguage("en")
            await use(i18n);
        },
    });

    test("Can successfully search for a valid product", async ({ page }) => {
        // Arrange
        const homePage = new HomePage(page)
        await navigateToHomePageAndWaitForProductsApi(homePage)

        // Act
        // To make the test a little more reliable, let's pick something that we think shouldn't be on the homepage by default
        // Ideally we'd have the test call the API to get page 2 and then use that, but for speed we'll just inject the search term 
        const searchTerm = 'screwdriver'
        await test.step(`Search for ${searchTerm}`, async () => {
            await homePage.filters.searchInput.fill(searchTerm)
            await Promise.all([
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products/search`) &&
                    resp.status() === 200
                ),
                homePage.filters.searchSubmit.click({ clickCount: 2, })
            ])
        })

        // Assert
        const productsDisplayed = await test.step('Retrieve displayed products', async () => {
            return await homePage.getAllVisibleProducts()
        })

        await test.step(`Verify that each displayed product contains \'${searchTerm}\' in its name`, async () => {
            for (const product of productsDisplayed) {
                await expect(product.name).toContainText(searchTerm, { ignoreCase: true })
            }
        })
    })


    test("Informative message shown when there are no valid products", async ({ page, i18n }) => {
        // Arrange
        const homePage = new HomePage(page)
        await navigateToHomePageAndWaitForProductsApi(homePage)

        // Act
        // Let's pick a search term that we're pretty confident isn't a product name!
        const searchTerm = 'hjfdsi ods'
        await test.step(`Search for ${searchTerm}`, async () => {
            await homePage.filters.searchInput.fill(searchTerm)
            await Promise.all([
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products/search`) &&
                    resp.status() === 200
                ),
                homePage.filters.searchSubmit.click({ clickCount: 2 })
            ])
        })

        // Assert
        const productsDisplayed = await test.step('Retrieve displayed products', async () => {
            return await homePage.getAllVisibleProducts()
        })

        await test.step(`Verify that no products are displayed along with some explainer text`, async () => {
            expect(productsDisplayed).toEqual([])
            await expect(homePage.noResults).toHaveText(i18n.t('pages:overview:no-results'))
        })
    })
})

test.describe(`Filtering products`, () => {
    test("Can successfully apply filters", async ({ page }) => {
        // Arrange
        const homePage = new HomePage(page)
        const categoriesList: Categories[] = await test.step('Navigate to home page', async () => {
            const [response] = await Promise.all([
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/categories/tree`) &&
                    resp.status() === 200
                ),
                homePage.goto(),
            ]);

            return (await response.json()) as Categories[];
        });

        // Act
        const testCategory = categoriesList
            .flatMap(c => [c, ...c.sub_categories])
            .find(c => c.name === "Screwdriver")
            // A bit hacky, because this data varies based on localisation
            // However, we need to pick a category where we know that there is at least one product
        await test.step(`Apply filter by category \'${testCategory.name}\'`, async () => {
            await homePage.filters.categoryCheckbox(testCategory.id).check()
            await homePage.page.waitForTimeout(1000) // HACK - wait for filters to apply
        })

        // Assert
        const productsDisplayed = await test.step('Retrieve displayed products', async () => {
            return await homePage.getAllVisibleProducts()
        })

        await test.step(`Verify that each displayed product is in the \'${testCategory.name}\' category`, async () => {
            for (const product of productsDisplayed) {
                await expect(product.name).toContainText(testCategory.name, { ignoreCase: true })
                // HACK - this won't be true in general, but it is for the screwdrivers
                // Ideally some part of the ProductCard component in the DOM would have an attribute containing the category id for the product, so we could assert by id instead
            }
        })
    })

    test("Can clear filters to return to the full list of products", async ({ page }) => {
        // Arrange
        const homePage = new HomePage(page)
        const [categoriesList, productsList] = await test.step('Navigate to home page', async () => {
            const [treeResponse, productsResponse] = await Promise.all([
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/categories/tree`) &&
                    resp.status() === 200
                ),
                homePage.page.waitForResponse(resp =>
                    resp.url().includes(`${process.env.API_BASE_URL}/products`) &&
                    resp.status() === 200
                ),
                homePage.goto(),
            ]);

            return [
                (await treeResponse.json()) as Categories[],
                (await productsResponse.json()).data as Product[],
            ]
        });
        const testCategory = categoriesList[0]
        await test.step(`Apply filter by category \'${testCategory.name}\'`, async () => {
            await homePage.filters.categoryCheckbox(testCategory.id).check()
            await homePage.page.waitForTimeout(1000) // HACK - wait for filters to apply
        })

        // Act
        await test.step(`Remove filters`, async () => {
            await homePage.filters.categoryCheckbox(testCategory.id).uncheck()
            // This works because we know that only one filter is applied
            // Honestly, the filters component could have a "clear all" button which we could use instead
            await homePage.page.waitForTimeout(1000) // HACK - wait for filters to apply
        })

        // Assert
        const productsDisplayed = await test.step('Retrieve displayed products', async () => {
            return await homePage.getAllVisibleProducts()
        })

        await test.step(`Verify that the displayed products are equivalent to the product list before filters were initially applied`, async () => {
            const displayedIds = productsDisplayed.map((p) => p.id)
            const initialIdsFromApi = productsList.map((p) => p.id)

            expect(displayedIds).toEqual(initialIdsFromApi)
        })
    })
})
