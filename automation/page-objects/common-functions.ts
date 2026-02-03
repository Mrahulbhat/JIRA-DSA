import { expect } from '@playwright/test';
import commonConstants from '../constants/commonConstants.js';
import { APIRequestContext } from '@playwright/test';
import { loginAndGetToken } from '../utils/authApi.js';
import { addProblem } from '../utils/problemApi.js';
import { APIResponse } from '@playwright/test';


export async function navigateToPage(page: any, pageName: string) {
    switch (pageName) {

        case commonConstants.urls.baseURL:
            await page.goto(commonConstants.urls.baseURL);
            break;

        case commonConstants.pageName.SIGNUP:
            await page.goto(`${commonConstants.urls.baseURL}/${commonConstants.pageName.SIGNUP}`);
            await expect(page).toHaveURL(`${commonConstants.urls.baseURL}/${commonConstants.pageName.SIGNUP}`);
            break;

        case commonConstants.pageName.DASHBOARD:
            await page.goto(`${commonConstants.urls.baseURL}/${commonConstants.pageName.DASHBOARD}`);
            await Promise.all([
                page.waitForResponse((response: any) => response.url().includes(commonConstants.fetchCountApi) && response.status() === 200, { timeout: 15000 }),
            ]);
            break;

        default: console.error('Invalid page name provided for navigation.');
            return;
    }
}


export async function waitForApiResponse(page: any, url: string) {
    try {
        await page.waitForResponse(
            (response: APIResponse) =>
                response.url().includes(url) &&
                (response.status() === 200 || response.status() === 304),
            { timeout: 15000 }
        );
    } catch {
        console.log('Intercept might have arrived before');
    }
}


export async function generateRandomPrefix(length: number = 5): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function loginUsingApi(
    request: APIRequestContext
): Promise<string> {
    const token = await loginAndGetToken(request);
    if (!token) {
        throw new Error("API Login failed: Token not received");
    }
    return token;
}

export async function addProblemViaApi(
    request: APIRequestContext
) {
    const token = await loginAndGetToken(request);
    const randomPrefix = generateRandomPrefix(3);

    return addProblem(
        request,
        {
            name: `${randomPrefix}_TEST_NAME`,
            difficulty: "Easy",
            topic: "Array",
            source: "Test_Source",
            problemLink: "https://testlink.com",
            tags: ["tag1", "tag2"],
            language: "TEST_LANGUAGE",
        },
        token
    );
}

export async function deleteUserViaApi(
    request: APIRequestContext,
    token: string
) {
    const response = await request.delete('/api/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok()) {
        const body = await response.text();
        throw new Error(`Delete user failed → ${response.status()} ${body}`);
    }

    return response.json();
}