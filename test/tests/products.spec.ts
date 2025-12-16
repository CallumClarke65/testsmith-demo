import { test } from "../test";

test.describe(`View Product List`, () => {

    test("Homepage displays a list of products  with names, images, and prices", async ({ page }) => {

        // Arrange

        // Act


        // Assert

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
