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

    // ----- PROBLEM OF THE DAY -----
    await expect(dashboardPage.potdSection).toBeVisible();
    await expect(dashboardPage.potdTitle).toBeVisible();

    const solveVisible = await dashboardPage.potdSolveBtn.isVisible().catch(() => false);
    const solvedVisible = await dashboardPage.potdSolvedBadge.isVisible().catch(() => false);
    expect(solveVisible || solvedVisible).toBeTruthy();

    if (solveVisible) {
      const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        dashboardPage.potdSolveBtn.click(),
      ]);
      await newTab.waitForLoadState();
      expect(newTab.url()).not.toContain('dashboard');
      await newTab.close();
    }

    // ----- QUICK ACTION BUTTONS -----
    await dashboardPage.addProblemBtn.click();
    await expect(page).toHaveURL(/\/problems\/add/);
    await page.goBack();

    await dashboardPage.leaderboardBtn.click();
    await expect(page).toHaveURL(/\/leaderboard/);
    await page.goBack();

    await dashboardPage.myChallengesBtn.click();
    await expect(page).toHaveURL(/\/challenges/);
    await page.goBack();

    // ----- COMMUNITY FEED -----
    await expect(dashboardPage.communityFeed).toBeVisible();
    const feedCount = await dashboardPage.feedItems.count();

    if (feedCount === 0) {
      await expect(page.locator('text=No activity yet')).toBeVisible();
    } else {
      await expect(dashboardPage.feedItems.first()).toBeVisible();
    }
  });

});
