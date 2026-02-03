import { expect, Locator, Page } from '@playwright/test';
import commonConstants from '../constants/commonConstants';

export class BasePage {
    public page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    setPage(newPage: Page) {
        this.page = newPage;
    }

     get backButton(): Locator {
        return this.page.locator('#backBtn');
    }

    get closeModalPopupBtn():Locator{
        return this.page.locator('#closePopupBtn');
    }

    // Sidebar Buttons
    get dashboardSidebarBtn(): Locator {
        return this.page.locator('#dashboard');
    }
    get myProblemsSidebarBtn(): Locator {
        return this.page.locator('#myProblems');
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

    //Methods

}