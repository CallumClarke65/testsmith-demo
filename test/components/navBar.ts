import { ComponentBase } from "../playwright/componentBase";

export class NavBar extends ComponentBase {
    readonly home = this.host.locator('[data-test="nav-home"]')
    readonly signIn = this.host.locator('[data-test="nav-sign-in"]')
    readonly userMenu = this.host.locator('[data-test="nav-menu"]')
}
