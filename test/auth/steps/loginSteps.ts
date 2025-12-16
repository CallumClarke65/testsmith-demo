import { TestUser } from "../../playwright/testUser";
import { step as baseStep } from "../../playwright/decorators"
import { Page } from "@playwright/test";

const step = baseStep('auth')

export class LoginSteps {

    constructor(readonly page: Page) {
        if (!process.env.AUTH_URL) {
            throw new Error(`AUTH_URL not defined, cannot perform user login steps`)
        }
    }

    @step
    async userPasswordLogin(user: TestUser) {

    }

    @step
    async preAuthUser(user: TestUser) {
        try {
            console.info(`Pre-authenticating user ${user.email}`)  
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