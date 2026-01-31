import { test } from '../../fixtures/test-base.js';
import { expect } from '@playwright/test';
import { navigateToPage } from '../../page-objects/common-functions.js';
import commonConstants from '../../constants/commonConstants.js';

//CAUTION : THIS IS FOR DATA SETUP

test.describe('Create Data Setup', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.loginUser();
    });
});
test.describe('Delete Data Setup', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.loginUser();
    });
});