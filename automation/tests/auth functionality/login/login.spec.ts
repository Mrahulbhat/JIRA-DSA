import { test } from '../../../fixtures/test-base.js';
import commonConstants from '../../../constants/commonConstants.js';
import { generateRandomPrefix } from '../../../page-objects/common-functions.js';

test.describe('Login Related Tests', () => {

    test('Login Functionality @BAT', async ({ page, loginPage }) => {
        const prefix = await generateRandomPrefix(5);
        const name = prefix + commonConstants.userName;
        const phone = prefix + commonConstants.phone;
        const password = commonConstants.password;

       await loginPage.loginUser();       
    });
});