import { Locator } from "@playwright/test";
import { ComponentBase } from "../../playwright/componentBase";

export class FilterControls extends ComponentBase {
    constructor(readonly host: Locator) {
        super(host)
    }

    readonly searchInput = this.host.locator('#search-query')
    readonly searchSubmit = this.host.locator('[data-test="search-submit"]')

    categoryCheckbox(categoryId: string): Locator {
        return this.host.locator(`[data-test="category-${categoryId}"]`)
    }
}