import { ComponentBase } from "../playwright/componentBase";

export class NavBar extends ComponentBase {
    readonly home = this.host.locator('[data-test="nav-home"]')
    readonly signIn = this.host.locator('[data-test="nav-sign-in"]')
    readonly userMenu = this.host.locator('[data-test="nav-menu"]')
    private readonly cartQuantity = this.host.locator('#lblCartCount')

    async getCartQuantity(): Promise<number> {
        // When the cart is empty, the cartQuantity element doesn't appear in the DOM
        if ((await this.cartQuantity.all()).length === 0) {
            return 0
        }
        return Number(await this.cartQuantity.textContent())
    }
}
