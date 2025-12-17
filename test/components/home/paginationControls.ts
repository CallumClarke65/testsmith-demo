import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";

export class PaginationControls extends ComponentBase {
    constructor(readonly host: Locator) {
        super(host)
    }

    page(number: number): Locator {
        return this.host.locator(`[aria-label="Page-${number}"]`)
    }

    readonly previous = this.host.locator('[aria-label="Previous"]')
    readonly next = this.host.locator('[aria-label="Next"]')

    async getCurrentPageNumber(): Promise<number> {
        const buttons = await this.host.locator('li').all()
        const active = buttons.find( async (l) => {
            return (await l.getAttribute('class')).includes('active')
        })
        return Number(active.textContent())
    }
}