import { expect } from "@playwright/test";
import { LoginSteps } from "../steps/loginSteps";
import { test } from "../test";
import { LoginPage } from "../pages/loginPage";
import { TestUsers } from "../testUsers";

test.use({
    i18n: async ({ i18n }, use) => {
        await i18n.changeLanguage("en")
        await use(i18n);
    },
});

test.describe(`Authentication`, () => {
    test("Can successfully login", async ({ page, testUsers }) => {
        const user = testUsers.customer2

        // Arrange
        const loginSteps = new LoginSteps(page)

        // Act
        const accountPage = await loginSteps.userPasswordLogin(user)

        // Assert
        await test.step(`Verify user \'${user.displayName}\' logged in successfully`, async () => {
            await expect(accountPage.page).toHaveURL(accountPage.url)
            await expect(accountPage.navBar.userMenu).toHaveText(user.displayName)
        })
    })

    test("Invalid login attempts display appropriate errors", async ({ page, i18n }) => {
        const loginPage = new LoginPage(page)

        // Arrange
        await test.step('Navigate to user login page', async () => {
            await loginPage.goto()
        })

        // Act
        await test.step('Attempt to login with a non-existent user', async () => {
            await loginPage.emailInput.fill(`invaliduser@invaliddomain.com`)
            await loginPage.passwordInput.fill('123')
            await loginPage.submit.click()
        })

        // Assert
        await test.step('Verify login failed with a warning', async () => {
            await expect(page).toHaveURL(loginPage.url)
            await expect(loginPage.loginError).toHaveText(i18n.t('pages:login:generic-error'))
        })
    })
})



test.describe(`View Order History`, () => {

    const user = new TestUsers().customer2

    test.use({
      storageState: `.auth/${user.userId}.json`,
    });

    // For both of these tests, the setup should be done via the API. But I don't really want to faff with a second authentication mechanism for now, so I'll just use the UI

    test("Can view previous orders", async ({ page }) => {

        // Arrange

    })

    test("Can view the details of a previous order", async ({ page }) => {

    })

})
