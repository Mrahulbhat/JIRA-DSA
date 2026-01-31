import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';
import commonConstants from '../constants/commonConstants';
import { waitForApiResponse } from './common-functions';
import { NavbarPage } from './navbar';

export class SignUpPage extends BasePage {
    readonly page: Page;
    readonly navbarPage: NavbarPage;

    constructor(page: Page, navbarPage: NavbarPage) {
        super(page);
        this.page = page;
        this.navbarPage = navbarPage;

    }

    /* -------------------- LOCATORS -------------------- */

    get signupLink(): Locator {
        return this.page.locator('#signupLink');
    }

    get nameInputField(): Locator {
        return this.page.locator('#nameInputField');
    }

    get phoneInputField(): Locator {
        return this.page.locator('#phoneInputField');
    }

    get passwordInputField(): Locator {
        return this.page.locator('#passwordInputField');
    }

    get confirmPasswordInputField(): Locator {
        return this.page.locator('#confirmPasswordInputField');
    }

    get termsConditionsCheckbox(): Locator {
        return this.page.locator('#termsConditionsCheckbox');
    }

    get signupButton(): Locator {
        return this.page.locator('#signupButton');
    }

    get googleSignupButton(): Locator {
        return this.page.locator('[data-testid="signup-google-button"]');
    }

    get passwordToggleButton(): Locator {
        return this.page.locator('#togglePasswordVisibilityButton');
    }

    get confirmPasswordToggleButton(): Locator {
        return this.page.locator('#toggleConfirmPasswordVisibilityButton');
    }

    /* -------------------- ACTIONS -------------------- */

    async createAccount(page: Page, name: string, phone: string, password: string) {
        await page.goto(commonConstants.urls.baseURL);
        await this.signupLink.click();
        await expect(this.page).toHaveURL(commonConstants.urls.baseURL + '/signup');
        await expect(this.nameInputField).toBeVisible();
        await this.nameInputField.fill(name);
        await this.phoneInputField.fill(phone);
        await this.passwordInputField.fill(password);
        await this.confirmPasswordInputField.fill(password);
        await this.termsConditionsCheckbox.check();
        await expect(this.termsConditionsCheckbox).toBeChecked();
        await this.signupButton.click();
        await waitForApiResponse(this.page, commonConstants.urls.registerApi);

        await expect(this.navbarPage.logoutBtn).toBeVisible();
    }
}
