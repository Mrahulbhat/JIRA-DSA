import { APIRequestContext } from "@playwright/test";
export type ProblemPayload = {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic:
    | "Sorting"
    | "Searching"
    | "Basic Math"
    | "Array"
    | "String"
    | "Bit Manipulation"
    | "Recursion"
    | "Hashing"
    | "Linked List"
    | "Stack"
    | "Queue"
    | "Tree"
    | "Graph"
    | "Dynamic Programming"
    | "Greedy"
    | "Backtracking"
    | "Two Pointers"
    | "Sliding Window"
    | "Heap"
    | "Trie"
    | "Others";
  source: string;
  problemLink: string;
  githubLink?: string;
  tags?: string[];
  language?: string;
  notes?: string;
};

export async function addProblem(
  request: APIRequestContext,
  payload: ProblemPayload,
  token: string
) {
  const response = await request.post("/api/problems/add", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  });

  if (!response.ok()) {
    const status = response.status();
    const statusText = response.statusText();
    const body = await response.text();

    console.error("API ERROR 👉", {
      status,
      statusText,
      body,
      payload,
    });

    throw new Error(`API failed with ${status} ${statusText}`);
  }

  return response.json();
}

