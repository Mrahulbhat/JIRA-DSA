

import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';

export class MyProblemsPage extends BasePage {
    readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    get addProblemBtn(): Locator {
        return this.page.locator('#addProblemBtn');
    }
    get ProblemNameInputField(): Locator {
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
    get problemLinkInputField(): Locator {
        return this.page.locator('#problemLinkInputField');
    }
    get tagsInputField(): Locator {
        return this.page.locator('#tagsInputField');
    }
    get notesInputField(): Locator {
        return this.page.locator('#notesInputField');
    }
    get SubmitBtn(): Locator {
        return this.page.locator('#SubmitBtn');
    }
    get solutionInputField(): Locator {
        return this.page.locator('#solutionInputField');
    }


    //have added locator to topic dropdwons dynamic

    //  async addProblems(page: Page, problems: string[]) {
    //     await 
    // }

}
