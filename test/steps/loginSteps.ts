import { TestUser } from "../playwright/testUser";
import { step as baseStep } from "../playwright/decorators"
import { Page } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { AccountPage } from "../pages/accountPage";

const step = baseStep('auth')

export class LoginSteps {

    private readonly loginPage: LoginPage

    constructor(private readonly page: Page) {
        this.loginPage = new LoginPage(page)
    }

    @step
    async userPasswordLogin(user: TestUser): Promise<AccountPage> {
        if (this.page.url() != this.loginPage.url) {
            await this.loginPage.goto()
        }

        await this.loginPage.emailInput.fill(user.email)
        await this.loginPage.passwordInput.fill(user.password)
        await this.loginPage.submit.click()
        await this.page.waitForLoadState('networkidle')
        return new AccountPage(this.page)
    }

    @step
    async preAuthUser(user: TestUser) {
        try {
            console.info(`Pre-authenticating user ${user.email}`)  
            await this.loginPage.goto()
            await this.userPasswordLogin(user)
            const authFile = `.auth/${user.userId}.json`;
            await this.page.context().storageState({ path: authFile });
          } catch (e) {
            await this.page?.screenshot({ path: `test-results/auth-failure-${user.email}.png` })
            console.warn(`Error during authentication for user ${user.email}`)
            throw (e)
          }
    }
}