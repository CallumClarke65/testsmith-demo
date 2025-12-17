import { expect } from "@playwright/test";
import { LoginSteps } from "../steps/loginSteps";
import { test } from "../test";
import { LoginPage } from "../pages/loginPage";
import { TestUsers } from "../testUsers";
import { InvoicesPage } from "../pages/invoicesPage";

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

    // For both of these tests, the setup should be done via the API that lets us put data in that we know will be there
    // (And furthermore, we want a test that's going to confirm to us that new orders can make it into history!)
    // However, on the prod demo, it seems that when I submit an order, it doesn't make it onto the order history page
    // So instead we'll just rely on the static data that I see there

    test("Can view previous orders", async ({ page }) => {
        const invoicesPage = new InvoicesPage(page)

        // Arrange / Act
        await test.step('Navigate to Order History', async () => {
            await invoicesPage.goto()
        })

        // Assert
        const invoiceRows = await test.step('Verify that previous orders are shown', async () => {
            const invoiceRows = await invoicesPage.invoiceRows()
            expect(invoiceRows.length).toBeGreaterThan(0)
            return invoiceRows
        })

        // It's Christmas, so we'll also do an extra generous extra assertion
        await test.step('Verify that known previous order is displayed on page 1', async () => {
            for (const r of invoiceRows) {
                if (await r.number.textContent() === 'INV-20250000039') {
                    await expect(r.total).toContainText('227.67')
                }
            }
        })
    })

    test("Can view the details of a previous order", async ({ page }) => {
        const invoicesPage = new InvoicesPage(page)

        // Arrange 
        await test.step('Navigate to Order History', async () => {
            await invoicesPage.goto()
        })

        // Act
        const [invoiceRow, invoiceDetailsPage] = await test.step('View the details of a previous order', async () => {
            const invoiceRows = await invoicesPage.invoiceRows()
            const row = invoiceRows[0]
            const number = await row.number.textContent()
            const address = await row.address.textContent()
            const date = await row.date.textContent()
            const total = await row.total.textContent()
            return [{
                number: number,
                address: address,
                date: date,
                total: total
            },
            await invoiceRows[0].viewDetails()]
        })

        // Assert
        await test.step('Verify that data shown on the overview page matches the data on the detail page', async () => {
            expect(await invoiceDetailsPage.number.inputValue()).toBe(invoiceRow.number)
            expect(await invoiceDetailsPage.street.inputValue()).toBe(invoiceRow.address)
            expect(await invoiceDetailsPage.date.inputValue()).toContain(invoiceRow.date)
            expect((await invoiceDetailsPage.total.inputValue()).replace(' ','')).toContain(invoiceRow.total)
        })
    })
})
