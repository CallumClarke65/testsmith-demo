import { expect } from "@playwright/test";
import { CheckoutPage } from "../pages/checkoutPage";
import { ProductSteps } from "../steps/productSteps";
import { test } from "../test";
import { TestUsers } from "../testUsers";

const user = new TestUsers().customer2
test.use({
    storageState: `.auth/${user.userId}.json`,
    i18n: async ({ i18n }, use) => {
        await i18n.changeLanguage("en")
        await use(i18n);
    },
});

test.describe(`Add products to cart`, () => {

    /*
    test("Can add an item to an empty cart", async ({ page }) => {
        // This is a complete duplicate of "Can add to cart as a visitor"
    })
    */

    test("Items added to the cart appear correctly in the cart summary", async ({ page }) => {
        const productSteps = new ProductSteps(page)
        const checkoutPage = new CheckoutPage(page)

        // Arrange
        const product = await productSteps.addProductToCartByName('Combination Pliers')

        // Act
        await test.step('Go to checkout', async () => {
            await checkoutPage.goto()
        })

        // Assert
        await test.step(`Verify product ${product.id} appears correctly in cart summary`, async () => {
            const cartItems = await checkoutPage.cartItems()
            const cartItem = await (async () => {
                for (const i of cartItems) { 
                    const title = await i.title.textContent()
                    if (title?.trim().toLowerCase() === product.name.toLowerCase()) {
                        return i
                    }
                }
                return undefined
            })()

            await expect(cartItem.title).toHaveText(product.name)
            await expect(cartItem.price).toContainText(String(product.price))
            await expect(cartItem.quantity).toHaveValue('1')
            await expect(cartItem.total).toContainText(String(product.price * 1))
        })
    })
})

test.describe(`Update or remove from cart`, () => {

    test("Can edit quantity of an item in the cart", async ({ page }) => {

    })

    test("Can remove an item in the cart", async ({ page }) => {

    })
})

test.describe(`Complete Checkout`, () => {

    test("Can successfully complete checkout", async ({ page }) => {

    })

    test("User blocked from completing checkout without valid shipping or payment details", async ({ page }) => {

    })

})
