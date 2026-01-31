/**
 * API base URL - ensures /api suffix for auth and data routes.
 * VITE_API_URL should be e.g. https://yoursite.com/api or http://localhost:5001/api
 */
export const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5001";
  if (url.endsWith("/api")) return url;
  return `${url.replace(/\/$/, "")}/api`;
};
