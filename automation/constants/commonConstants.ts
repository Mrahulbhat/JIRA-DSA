const test_date = new Date().toISOString().split('T')[0]; //current date in YYYY-MM-DD format

const commonConstants = {

    userName: 'test_name',
    phone:'9876543210',
    password: 'test123',

    //Network intercepts
    fetchCountApi:'/api/challenges/pending-count',

    urls: {
        baseURL: 'https://jira-dsa.vercel.app',      
    },

    pageName: {
        SIGNUP: 'signup',
        DASHBOARD: 'dashboard',
       
    },

    toastMessages: {
        TRANSACTION_ADDED_SUCCESSFULLY: 'Transaction added successfully',
        
    },

    //update all to test once testing is complete
    CATEGORIES: [
        { name: "Food", type: "expense", parentCategory: "Needs", budget: "1000" },
        
    ],

    //update all to test once testing is complete
    ACCOUNTS: [
        { name: "CANARA_BANK", balance: "1000" },
    ],
};

export default commonConstants;