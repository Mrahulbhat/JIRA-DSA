import { test } from '../fixtures/test-base.ts';
import { expect } from '@playwright/test';
import commonConstants from '../constants/commonConstants.ts';
import { waitForApiResponse } from '../page-objects/common-functions.ts';
import { addProblem } from "../utils/problemApi";
import { loginAndGetToken } from "../utils/authApi";
import { generateRandomPrefix } from '../page-objects/common-functions.ts';


test.describe('My Problems Page related Tests', () => {
    test.beforeEach(async ({ page, loginPage }) => {
        //login via api
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

        // Add 2 problems from set of problems declared in common constants file
        for (const p of commonConstants.problemsToAdd) {
            await myProblemsPage.addProblem(page, p.title, p.difficulty, p.topic, p.platform, p.problemLink, p.solutionLink, p.tags, p.notes);
        }

        await dashboardPage.dashboardSidebarBtn.click();
        await waitForApiResponse(page, commonConstants.fetchProblemsApi);

        //store present count of problems solved from dashboard
        await expect(dashboardPage.totalSolved).toBeVisible();
        const finalCount = await dashboardPage.problemsCountValue.innerText();
        console.log(finalCount);
        expect(finalCount === problemCount+commonConstants.problemsToAdd.length);
    });


    test.only("Add problems via API", async ({ request }) => {
        const token = await loginAndGetToken(request);
        const randomPrefix = generateRandomPrefix(3);

        await addProblem(
            request,
            {
                name: randomPrefix+"TEST_NAME",
                difficulty: "Easy",
                topic: "Array",
                source: "Test_Source",
                problemLink: "https://testlink.com",
                tags: ["tag1","tag2"],
                language: "TEST_LANGUAGE",
            },
            token
        );
    });
})
