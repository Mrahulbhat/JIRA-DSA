import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';
import commonConstants from '../constants/commonConstants';
import { navigateToPage, waitForApiResponse } from './common-functions';

export class NavbarPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  /* -------------------- LOCATORS -------------------- */

  get logoutBtn(): Locator {
    return this.page.locator('#logoutBtn');
  }
}