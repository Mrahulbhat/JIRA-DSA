import { test } from '../../fixtures/test-base.js';
import { expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/dashboard.js';
import { navigateToPage } from '../../page-objects/common-functions.js';
import commonConstants from '../../constants/commonConstants.js';

test.describe('Dashboard related test cases', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.loginUser();
    await navigateToPage(page,commonConstants.pageName.DASHBOARD);
  });

  test('Streak and stats cards are visible with valid values', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await expect(dashboard.currentStreak).toBeVisible();
    await expect(dashboard.totalSolved).toBeVisible();
    await expect(dashboard.weeklyGoal).toBeVisible();
    await expect(dashboard.globalRank).toBeVisible();

    // Value sanity checks (not empty)
    await expect(dashboard.currentStreak).not.toHaveText('');
    await expect(dashboard.totalSolved).not.toHaveText('');
  });

  test('Problem of the Day section is displayed', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await expect(dashboard.potdSection).toBeVisible();
    await expect(dashboard.potdTitle).toBeVisible();

    // Either Solve Now OR Solved badge should be visible
    const solveVisible = await dashboard.potdSolveBtn.isVisible().catch(() => false);
    const solvedVisible = await dashboard.potdSolvedBadge.isVisible().catch(() => false);

    expect(solveVisible || solvedVisible).toBeTruthy();
  });

  test('Solve Now button opens problem link in new tab (if unsolved)', async ({ page, context }) => {
    const dashboard = new DashboardPage(page);

    if (await dashboard.potdSolveBtn.isVisible()) {
      const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        dashboard.potdSolveBtn.click(),
      ]);

      await newTab.waitForLoadState();
      expect(newTab.url()).not.toContain('dashboard');
    } else {
      test.skip(true, 'Problem already solved');
    }
  });

  test('Quick action - Add Problem button navigates correctly', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.addProblemBtn.click();
    await expect(page).toHaveURL(/\/problems\/add/);
  });

  test('Quick action - Leaderboard button navigates correctly', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.leaderboardBtn.click();
    await expect(page).toHaveURL(/\/leaderboard/);
  });

  test('Community activity section loads items or shows empty state', async ({ page }) => {
    const feed = page.getByTestId('community-feed');

    await expect(feed).toBeVisible();

    const items = page.getByTestId('feed-item');
    const count = await items.count();

    // Either feed has items OR empty state text exists
    if (count === 0) {
      await expect(page.locator('text=No activity yet')).toBeVisible();
    } else {
      await expect(items.first()).toBeVisible();
    }
  });

});
