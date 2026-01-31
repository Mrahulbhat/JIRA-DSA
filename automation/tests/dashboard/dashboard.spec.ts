import { test } from '../../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/dashboard.ts';
import { navigateToPage } from '../../page-objects/common-functions.ts';
import commonConstants from '../../constants/commonConstants.ts';

test.describe('Dashboard full page validation', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.loginUser();
    await navigateToPage(page, commonConstants.pageName.DASHBOARD);
  });

  test('Validate entire dashboard functionality', async ({ page, dashboardPage,context }) => {

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
});
