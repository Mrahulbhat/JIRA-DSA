import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';

export class DashboardPage extends BasePage {
  readonly page: Page;

  // Header
  readonly title: Locator;

  // Cards
  readonly currentStreak: Locator;
  readonly totalSolved: Locator;
  readonly weeklyGoal: Locator;
  readonly globalRank: Locator;

  // POTD
  readonly potdSection: Locator;
  readonly potdTitle: Locator;
  readonly potdSolveBtn: Locator;
  readonly potdSolvedBadge: Locator;

  // Quick actions
  readonly addProblemBtn: Locator;
  readonly leaderboardBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.title = page.getByTestId('dashboard-title');

    this.currentStreak = page.getByTestId('current-streak-value');
    this.totalSolved = page.getByTestId('total-solved-value');
    this.weeklyGoal = page.getByTestId('weekly-progress-value');
    this.globalRank = page.getByTestId('global-rank-value');

    this.potdSection = page.getByTestId('potd-section');
    this.potdTitle = page.getByTestId('potd-title');
    this.potdSolveBtn = page.getByTestId('potd-solve-btn');
    this.potdSolvedBadge = page.getByTestId('potd-solved-badge');

    this.addProblemBtn = page.getByTestId('add-problem-btn');
    this.leaderboardBtn = page.getByTestId('leaderboard-btn');
  }

  async verifyDashboardLoaded() {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText('DSA Arena');
  }
}
