const test_date = new Date().toISOString().split('T')[0]; //current date in YYYY-MM-DD format

const commonConstants = {

    userName: 'test_name',
    phone: '9876543210',
    password: 'test123',

    //Network intercepts
    fetchCountApi: '/api/challenges/pending-count',
    fetchProblemsApi: '/api/problems',
    addProblemApi:'/api/problems/add',

    urls: {
        baseURL: 'https://jira-dsa.vercel.app',
    },

    pageName: {
        SIGNUP: 'signup',
        DASHBOARD: 'dashboard',

    },

    toastMessages: {
        PROBLEM_ADDED_SUCCESSFULLY: 'Problem added successfully',

    },

    //update all to test once testing is complete
    CATEGORIES: [
        { name: "Food", type: "expense", parentCategory: "Needs", budget: "1000" },

    ],

    //update all to test once testing is complete
    ACCOUNTS: [
        { name: "CANARA_BANK", balance: "1000" },
    ],

    problemsToAdd: [
        {
            title: "Two Sum",
            difficulty: "Easy",
            topic: "Array",
            platform: "LeetCode",
            problemLink: "https://leetcode.com/problems/two-sum/",
            solutionLink: "https://github.com/user/solutions/blob/main/two_sum.js",
            tags: "array,hashmap",
            notes: "Classic hash map problem."
        },
        {
            title: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
            topic: "String",
            platform: "LeetCode",
            problemLink: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
            solutionLink: "https://github.com/user/solutions/blob/main/longest_substring.js",
            tags: "string,sliding-window",
            notes: "Use sliding window with hash set."
        },
        {
            title: "Merge Two Sorted Lists",
            difficulty: "Easy",
            topic: "Linked List",
            platform: "LeetCode",
            problemLink: "https://leetcode.com/problems/merge-two-sorted-lists/",
            solutionLink: "https://github.com/user/solutions/blob/main/merge_lists.js",
            tags: "linkedlist,recursion",
            notes: "Recursive merge of two lists."
        },
        {
            title: "Course Schedule",
            difficulty: "Medium",
            topic: "Graph",
            platform: "LeetCode",
            problemLink: "https://leetcode.com/problems/course-schedule/",
            solutionLink: "https://github.com/user/solutions/blob/main/course_schedule.js",
            tags: "graph,topological-sort",
            notes: "Detect cycle using DFS."
        },
        {
            title: "Minimum Window Substring",
            difficulty: "Hard",
            topic: "String",
            platform: "LeetCode",
            problemLink: "https://leetcode.com/problems/minimum-window-substring/",
            solutionLink: "https://github.com/user/solutions/blob/main/min_window.js",
            tags: "string,sliding-window,hashmap",
            notes: "Use two-pointer sliding window technique."
        },
    ],
};

export default commonConstants;