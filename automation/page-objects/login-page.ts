import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';
import commonConstants from '../constants/commonConstants';
import { navigateToPage, waitForApiResponse } from './common-functions';
import { NavbarPage } from './navbar';

export class LoginPage extends BasePage {
    readonly page: Page;
    readonly navbarPage: NavbarPage;

    constructor(page: Page, navbarPage: NavbarPage) {
        super(page);
        this.page = page;
        this.navbarPage = navbarPage;
    }

    get phoneNumberInputField(): Locator {
        return this.page.locator('#phoneInputField');
    }
    get passwordInputField(): Locator {
        return this.page.locator('#passwordInputField');
    }
    get remembermeCheckbox(): Locator {
        return this.page.locator('#rememberMeCheckbox');
    }
    get loginButton(): Locator {
        return this.page.locator('#loginButton');
    }
    get signupLink(): Locator {
        return this.page.locator('#signupLink');
    }

    async loginUser() {
        await navigateToPage(this.page, commonConstants.urls.baseURL);
        await this.phoneNumberInputField.fill(commonConstants.phone);
        await this.passwordInputField.fill(commonConstants.password);
        await this.loginButton.click();
        await waitForApiResponse(this.page, commonConstants.urls.loginApi);
        await expect(this.navbarPage.logoutBtn).toBeVisible();
        // await expect(this.
    }


}