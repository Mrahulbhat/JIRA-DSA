import { APIRequestContext } from "@playwright/test";

type ProblemPayload = {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  source: string;
  problemLink: string;
  githubLink?: string;
  tags?: string[];
  language?: string;
  notes?: string;
};

export async function addProblem(
  request: APIRequestContext,
  payload: ProblemPayload
) {
  const response = await request.post("/api/problems/add", {
    data: payload
  });

  if (!response.ok()) {
    throw new Error(await response.text());
  }

  return response.json();
}
