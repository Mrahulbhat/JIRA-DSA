import { test } from '../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import commonConstants from '../constants/commonConstants.ts';
import { waitForApiResponse } from '../page-objects/common-functions.ts';

test.describe('Signup Related Tests', () => {

    test.skip('Create Account / Singup Functionality @BAT', async ({ page, signupPage }) => {
        const name = commonConstants.userName;
        const phone = commonConstants.phone;
        const password = commonConstants.password;
        await signupPage.createAccount(page, name, phone, password);
    });

    test.skip('Delete a account @BAT', async ({ page, loginPage }) => {
        await loginPage.loginUser();
        await expect(loginPage.settingsSidebarBtn).toBeVisible();
        await loginPage.settingsSidebarBtn.click();
        await expect(loginPage.deleteMyAccountBtn).toBeVisible();
        await loginPage.deleteMyAccountBtn.click();
        await expect(loginPage.cancelDeleteButton).toBeVisible();
        await expect(loginPage.confirmDeleteButton).toBeVisible();
        await loginPage.confirmDeleteButton.click();
        await waitForApiResponse(page,'me');
        await expect(page).toHaveURL(commonConstants.urls.baseURL+'/login');
    })
});
test.describe('Login Related Tests', () => {

    test('Login Functionality @BAT', async ({ page, loginPage }) => {
        await loginPage.loginUser();
    });
});


