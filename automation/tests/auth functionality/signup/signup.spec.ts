import { test } from '../../../fixtures/test-base.js';
import commonConstants from '../../../constants/commonConstants.js';

test.describe('Login Related Tests', () => {

    test('Create Account / Singup Functionality @BAT', async ({ page, signupPage }) => {
        const name = commonConstants.userName;
        const phone =  commonConstants.phone;
        const password = commonConstants.password;
       await signupPage.createAccount(page,name,phone,password);       
    });
});