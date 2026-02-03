import { test } from '../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import commonConstants from '../constants/commonConstants.ts';
import { waitForApiResponse } from '../page-objects/common-functions.ts';
import { addProblem } from "../utils/problemApi";


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

    // test('Verify if Problem Count in Dashboard card is accurate', async ({ page, loginPage, dashboardPage }) => {
    //     await expect(page.getByText('DSA Arena')).toBeVisible();
    //     await expect(dashboardPage.totalSolved).toBeVisible();
    //     const problemCount = await dashboardPage.problemsCountValue.innerText();
    //     console.log(problemCount);
    // });
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

        //navigate to myproblems page
        await myProblemsPage.myProblemsSidebarBtn.click();
        await waitForApiResponse(page, commonConstants.fetchProblemsApi);
        await expect(myProblemsPage.addProblemBtn).toBeVisible();

        // Add many problems
        for (const p of commonConstants.problemsToAdd) {
            await myProblemsPage.addProblem(page, p.title, p.difficulty, p.topic, p.platform, p.problemLink, p.solutionLink, p.tags, p.notes);
        }

        await dashboardPage.dashboardSidebarBtn.click();
        await waitForApiResponse(page, commonConstants.fetchProblemsApi);

        //store present count of problems solved from dashboard
        await expect(dashboardPage.totalSolved).toBeVisible();
        const finalCount = await dashboardPage.problemsCountValue.innerText();
        console.log(finalCount);
        expect(finalCount === problemCount + commonConstants.problemsToAdd.length);
    });

    test("Seed 10 problems using API", async ({ request, page }) => {

        const problems = Array.from({ length: 10 }, (_, i) => ({
            name: `array problem ${i + 1}`,
            difficulty: "Easy" as const,
            topic: "Array",
            source: "LeetCode",
            problemLink: `https://leetcode.com/problems/auto-${i + 1}`,
            tags: ["array"],
            language: "Java"
        }));

        for (const problem of problems) {
            await addProblem(request, problem);
        }

        await page.goto("/problems");
    });

})
