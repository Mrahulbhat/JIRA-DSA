

import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';
import { waitForApiResponse } from './common-functions';
import commonConstants from '../constants/commonConstants';

export class MyProblemsPage extends BasePage {
    readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    get addProblemBtn(): Locator {
        return this.page.locator('#addProblemBtn');
    }
    get problemNameInputField(): Locator {
        return this.page.locator('#ProblemNameInputField');
    }
    get difficultyDropdown(): Locator {
        return this.page.locator('#difficultyDropdown');
    }
    get easyOption(): Locator {
        return this.page.locator('#easy');
    }
    get mediumOption(): Locator {
        return this.page.locator('#medium');
    }
    get hardOption(): Locator {
        return this.page.locator('#hard');
    }
    get topicDropdown(): Locator {
        return this.page.locator('#topicDropdown');
    }
    get platformName(): Locator {
        return this.page.locator('#platformName');
    }
    get problemLinkInputField(): Locator {
        return this.page.locator('#problemLinkInputField');
    }
    get tagsInputField(): Locator {
        return this.page.locator('#tagsInputField');
    }
    get notesInputField(): Locator {
        return this.page.locator('#notesInputField');
    }
    get submitBtn(): Locator {
        return this.page.locator('#SubmitBtn');
    }
    get solutionInputField(): Locator {
        return this.page.locator('#solutionInputField');
    }

    //have added locator to topic dropdwons dynamic

    async addProblem(page: Page, title: string, difficulty: string, topic: string, platform: string,problemLink:string,solutionLink:string,tags:string,notes:string) {

        // navigate to add problem page
        await this.addProblemBtn.click();
        await expect(this.problemLinkInputField).toBeVisible();
        await this.problemNameInputField.fill(title);
        await this.difficultyDropdown.selectOption(difficulty);
        await this.topicDropdown.selectOption(topic);
        await this.platformName.fill(platform);
        await this.problemLinkInputField.fill(problemLink);
        await this.solutionInputField.fill(solutionLink);
        await this.tagsInputField.fill(tags);
        await this.notesInputField.fill(notes);
        await this.submitBtn.click();
        await expect(this.page.getByText(commonConstants.toastMessages.PROBLEM_ADDED_SUCCESSFULLY)).toBeVisible();
        await waitForApiResponse(page,commonConstants.fetchProblemsApi);
    }

}
