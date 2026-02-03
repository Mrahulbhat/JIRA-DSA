import { test } from '../../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import commonConstants from '../../constants/commonConstants.ts';
import { waitForApiResponse } from '../../page-objects/common-functions.ts';
import { deleteUserViaApi } from '../../page-objects/common-functions.ts';
import { loginUsingApi } from '../../page-objects/common-functions.ts';

test.describe('Authentication Tests', () => {
    test('Delete a account @BAT', async ({ page, loginPage }) => {
        await loginPage.loginUser();
        await expect(loginPage.settingsSidebarBtn).toBeVisible();
        await loginPage.settingsSidebarBtn.click();
        await expect(loginPage.deleteMyAccountBtn).toBeVisible();
        await loginPage.deleteMyAccountBtn.click();
        await expect(loginPage.cancelDeleteButton).toBeVisible();
        await expect(loginPage.confirmDeleteButton).toBeVisible();
        await loginPage.confirmDeleteButton.click();
        await waitForApiResponse(page, 'me');
        await expect(page).toHaveURL(commonConstants.urls.baseURL + '/login');
    })

    test('Delete a account via API', async ({ request }) => {
        const token = await loginUsingApi(request);
        const response = await deleteUserViaApi(request, token);
        expect(response.success).toBeTruthy();
    })
})
