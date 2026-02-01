import { test } from '../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import commonConstants from '../constants/commonConstants.ts';
import { generateRandomPrefix, waitForApiResponse } from '../page-objects/common-functions.ts';

test.describe('Dashboard Related Tests', () => {
    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.loginUser();
        await expect(page.getByText('DSA Arena')).toBeVisible();
    });

    test('Validate basic dashboard visibility functionality', async ({ page, dashboardPage, loginPage }) => {

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
    });
});

test.describe('My Problems Page related Tests', () => {
    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.loginUser();
        await expect(page.getByText('DSA Arena')).toBeVisible();
    });

    test('Verify if a user can Add problems solved by him', async ({ page, myProblemsPage, dashboardPage }) => {

        //store initial count of problems solved from dashboard
        await expect(dashboardPage.totalSolved).toBeVisible();
        const problemCount = await dashboardPage.problemsCountValue.innerText();
        console.log(problemCount);

        const problems = commonConstants.problemsToAdd;

        for (const p of problems) {
            await myProblemsPage.addProblem(page, p.title, p.difficulty, p.topic, p.platform, p.problemLink, p.solutionLink, p.tags, p.notes);
        }
    });


})
