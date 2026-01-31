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

  // Problem of the Day
  readonly potdSection: Locator;
  readonly potdTitle: Locator;
  readonly potdSolveBtn: Locator;
  readonly potdSolvedBadge: Locator;

  // Quick actions
  readonly addProblemBtn: Locator;
  readonly leaderboardBtn: Locator;
  readonly myChallengesBtn: Locator;

  // Community Feed
  readonly communityFeed: Locator;
  readonly feedItems: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Header
    this.title = page.getByTestId('header-title');

    // Cards
    this.currentStreak = page.getByTestId('current-streak');
    this.totalSolved = page.getByTestId('total-solved');
    this.weeklyGoal = page.getByTestId('weekly-goal');
    this.globalRank = page.getByTestId('global-rank');

    // Problem of the Day
    this.potdSection = page.getByTestId('problem-of-the-day');
    this.potdTitle = this.potdSection.locator('h3, h2'); // matches h2/h3 inside POTD
    this.potdSolveBtn = this.potdSection.getByTestId('solve-now-button');
    this.potdSolvedBadge = this.potdSection.locator('text=Solved');

    // Quick actions
    this.addProblemBtn = page.getByTestId('add-problem-quick');
    this.leaderboardBtn = page.getByTestId('view-leaderboard-quick');
    this.myChallengesBtn = page.getByTestId('my-challenges-quick');

    // Community feed
    this.communityFeed = page.getByTestId('community-activity');
    this.feedItems = this.communityFeed.getByTestId('feed-item');
  }

  async verifyDashboardLoaded() {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText(/DSA Arena/i);
  }
}
