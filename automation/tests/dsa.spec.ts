import { test } from '../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import commonConstants from '../constants/commonConstants.ts';
import { navigateToPage, waitForApiResponse } from '../page-objects/common-functions.ts';

test.describe.serial('Automation Tests', () => {

    test.describe('Dashboard Related Tests', () => {
        test.beforeEach(async ({ loginPage }) => {
            await loginPage.loginUser();
        });

        test('Validate basic dashboard visibility functionality', async ({ page, dashboardPage, loginPage }) => {

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

        test('Verify if Problem Count in Dashboard card is accurate', async ({ page, loginPage, dashboardPage }) => {

            await expect(page.getByText('DSA Arena')).toBeVisible();
            await expect(dashboardPage.totalSolved).toBeVisible();
            const problemCount = await dashboardPage.problemsCountValue.innerText();
            console.log(problemCount);

        })
    });
})
