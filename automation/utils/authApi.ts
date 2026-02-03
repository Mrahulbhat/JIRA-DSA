import { APIRequestContext } from "@playwright/test";

export async function loginAndGetToken(request: APIRequestContext) {
  const response = await request.post("/api/auth/login", {
    data: {
      phone:'9876543210',
      password: "test123",
    },
  });

  const status = response.status();
  const statusText = response.statusText();
  const body = await response.text();

  if (!response.ok()) {
    console.error("LOGIN API ERROR 👉", {
      status,
      statusText,
      body,
    });

    throw new Error("Login failed");
  }

  console.log("LOGIN SUCCESS 👉", body);

  const json = JSON.parse(body);
  return json.token; 
}
