import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';

export class DashboardPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  /* -------------------- HEADER -------------------- */
  get title(): Locator {
    return this.page.locator('#header-title');
  }

  /* -------------------- CARDS -------------------- */
  get currentStreak(): Locator {
    return this.page.locator('#current-streak');
  }

  get totalSolved(): Locator {
    return this.page.locator('#total-solved');
  }

  get problemsCountValue(): Locator {
    return this.page.locator('#problemsCountValue');
  }

  get weeklyGoal(): Locator {
    return this.page.locator('#weekly-goal');
  }

  get globalRank(): Locator {
    return this.page.locator('#global-rank');
  }

  /* -------------------- PROBLEM OF THE DAY -------------------- */
  get potdSection(): Locator {
    return this.page.locator('#problem-of-the-day');
  }

  get potdTitle(): Locator {
    return this.potdSection.locator('#h3, h2');
  }

  get potdSolveBtn(): Locator {
    return this.potdSection.locator('#solve-now-button');
  }

  get potdSolvedBadge(): Locator {
    return this.potdSection.locator('#text=Solved');
  }

  /* -------------------- QUICK ACTIONS -------------------- */
  get addProblemBtn(): Locator {
    return this.page.locator('#add-problem-quick');
  }

  get leaderboardBtn(): Locator {
    return this.page.locator('#view-leaderboard-quick');
  }

  get myChallengesBtn(): Locator {
    return this.page.locator('#my-challenges-quick');
  }

  /* -------------------- COMMUNITY FEED -------------------- */
  get communityFeed(): Locator {
    return this.page.locator('#community-activity');
  }

  get feedItems(): Locator {
    return this.communityFeed.locator('#feed-item');
  }

  /* -------------------- METHODS -------------------- */

}
