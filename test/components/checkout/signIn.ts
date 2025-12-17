import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";

export class SignIn extends ComponentBase {
    constructor(readonly host: Locator) {
        super(host)
    }

    readonly next = this.host.page().locator('[data-test="proceed-2"]')
}