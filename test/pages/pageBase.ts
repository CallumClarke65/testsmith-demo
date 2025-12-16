import { Page } from "@playwright/test";
import { NavBar } from "../components/navBar";
import { PageBase } from "../playwright/pageBase";

export abstract class ToolShopPage extends PageBase {
    public navBar: NavBar

    constructor(readonly page: Page, readonly url: string) {
        super(page, url)
        this.navBar = new NavBar(this.page.locator("nav"));
    }
}