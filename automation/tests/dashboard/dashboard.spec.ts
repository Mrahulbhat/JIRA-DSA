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

  test('Validate entire dashboard functionality', async ({ page, context }) => {
    const dashboard = new DashboardPage(page);

    // ----- HEADER -----
    await expect(dashboard.title).toBeVisible();
    await expect(dashboard.title).toHaveText(/DSA Arena/i);

    // ----- CARDS -----
    await expect(dashboard.currentStreak).toBeVisible();
    await expect(dashboard.totalSolved).toBeVisible();
    await expect(dashboard.weeklyGoal).toBeVisible();
    await expect(dashboard.globalRank).toBeVisible();

    await expect(dashboard.currentStreak).not.toHaveText('');
    await expect(dashboard.totalSolved).not.toHaveText('');

    // ----- PROBLEM OF THE DAY -----
    await expect(dashboard.potdSection).toBeVisible();
    await expect(dashboard.potdTitle).toBeVisible();

    const solveVisible = await dashboard.potdSolveBtn.isVisible().catch(() => false);
    const solvedVisible = await dashboard.potdSolvedBadge.isVisible().catch(() => false);
    expect(solveVisible || solvedVisible).toBeTruthy();

    if (solveVisible) {
      const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        dashboard.potdSolveBtn.click(),
      ]);
      await newTab.waitForLoadState();
      expect(newTab.url()).not.toContain('dashboard');
      await newTab.close();
    }

    // ----- QUICK ACTION BUTTONS -----
    await dashboard.addProblemBtn.click();
    await expect(page).toHaveURL(/\/problems\/add/);
    await page.goBack();

    await dashboard.leaderboardBtn.click();
    await expect(page).toHaveURL(/\/leaderboard/);
    await page.goBack();

    await dashboard.myChallengesBtn.click();
    await expect(page).toHaveURL(/\/challenges/);
    await page.goBack();

    // ----- COMMUNITY FEED -----
    await expect(dashboard.communityFeed).toBeVisible();
    const feedCount = await dashboard.feedItems.count();

    if (feedCount === 0) {
      await expect(page.locator('text=No activity yet')).toBeVisible();
    } else {
      await expect(dashboard.feedItems.first()).toBeVisible();
    }
  });

});
