import { test as base } from '@playwright/test';
import { BasePage } from '../page-objects/basepage';
import { DashboardPage } from '../page-objects/dashboard';
import { NavbarPage } from '../page-objects/navbar';
import { LoginPage } from '../page-objects/login-page';
import { SignUpPage } from '../page-objects/signupPage';
import { MyProblemsPage } from '../page-objects/problems';

type fixtures = {
    basePage: BasePage;
    dashboardPage: DashboardPage;
    loginPage: LoginPage;
    signupPage: SignUpPage;
    navbarPage: NavbarPage;
    myProblemsPage:MyProblemsPage;
}

export const test = base.extend<fixtures>({
    page: async ({ page }, use) => {
        await page.addInitScript(() => {
            (window as any).inAutomation = true;
        });
        await use(page);
    },
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    navbarPage: async ({ page }, use) => {
        await use(new NavbarPage(page));
    },
    loginPage: async ({ page, navbarPage }, use) => {
        await use(new LoginPage(page, navbarPage));
    },
    signupPage: async ({ page, navbarPage }, use) => {
        await use(new SignUpPage(page, navbarPage));
    },
     myProblemsPage: async ({ page }, use) => {
        await use(new MyProblemsPage(page));
    },

});