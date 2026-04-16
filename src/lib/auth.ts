import {createInternalNeonAuth} from "@neondatabase/neon-js/auth";

const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL;
const neonAuth = createInternalNeonAuth(neonAuthUrl ?? "");

export async function getAuthToken() {
  if (!neonAuthUrl) {
    return null;
  }

  try {
    return await neonAuth.getJWTToken();
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
}

export const authClient = neonAuth.adapter;
