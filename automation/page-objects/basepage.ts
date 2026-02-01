import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
    public page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    setPage(newPage: Page) {
        this.page = newPage;
    }

    // Sidebar Buttons
    get dashboardSidebarBtn(): Locator {
        return this.page.locator('#dashboard');
    }
    get settingsSidebarBtn(): Locator {
        return this.page.locator('#settings');
    }
    get deleteMyAccountBtn(): Locator {
        return this.page.locator('#deleteMyAccountBtn');
    }
    get cancelDeleteButton(): Locator {
        return this.page.locator('#cancelDeleteButton');
    } 
    get confirmDeleteButton(): Locator {
        return this.page.locator('#confirmDeleteButton');
    }


}