import { test } from '../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import commonConstants from '../constants/commonConstants.ts';
import { navigateToPage, waitForApiResponse } from '../page-objects/common-functions.ts';

test.describe.serial('Automation Tests', () => {

    test.describe('Signup Related Tests', () => {

        test('Create Account / Singup Functionality @BAT', async ({ page, signupPage }) => {
            const name = commonConstants.userName;
            const phone = commonConstants.phone;
            const password = commonConstants.password;
            await signupPage.createAccount(page, name, phone, password);
        });
    });
    test.describe('Login Related Tests', () => {

        test('Login Functionality @BAT', async ({ loginPage }) => {
            await loginPage.loginUser();
        });
    });

    test('Validate entire dashboard functionality', async ({ page, dashboardPage }) => {
        await navigateToPage(page, commonConstants.pageName.DASHBOARD);
        // ----- HEADER -----
        await expect(page.getByText('DSA Arena')).toBeVisible();

        // ----- CARDS -----
        await expect(dashboardPage.currentStreak).toBeVisible();
        await expect(dashboardPage.totalSolved).toBeVisible();
        await expect(dashboardPage.weeklyGoal).toBeVisible();
        await expect(dashboardPage.globalRank).toBeVisible();

        await expect(dashboardPage.currentStreak).not.toHaveText('');
        await expect(dashboardPage.totalSolved).not.toHaveText('');

        // ----- QUICK ACTION BUTTONS -----
        await expect(dashboardPage.addProblemBtn).toBeVisible();
        await expect(dashboardPage.leaderboardBtn).toBeVisible();
        await expect(dashboardPage.myChallengesBtn).toBeVisible();
    });


    test.describe('Delete Account Test', () => {
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
    })
})
