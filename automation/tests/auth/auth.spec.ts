import { test } from '../../fixtures/test-base.ts';
import commonConstants from '../../constants/commonConstants.ts';

test.describe.serial('Authentication Tests', () => {

    test('Create Account / Singup Functionality', async ({ page, signupPage }) => {
        const name = commonConstants.userName;
        const phone = commonConstants.phone;
        const password = commonConstants.password;
        await signupPage.createAccount(page, name, phone, password);
    });

    test('Login Functionality', async ({ loginPage }) => {
        await loginPage.loginUser();
    });
})
