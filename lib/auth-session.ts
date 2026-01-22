import { cookies } from "next/headers";

const USER_ID_COOKIE_NAME = "dashboard_user_id";

/**
 * Returns the authenticated user ID from the HTTP-only cookie,
 * or null if the user is not signed in.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(USER_ID_COOKIE_NAME)?.value;
  return value ?? null;
}

/**
 * Sets the authenticated user ID cookie after a successful sign-in.
 * The cookie is HTTP-only and scoped to the entire app.
 */
export async function setAuthenticatedUserId(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_ID_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

/**
 * Clears the authenticated user ID cookie (used on sign-out).
 */
export async function clearAuthenticatedUser() {
  const cookieStore = await cookies();
  cookieStore.set(USER_ID_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}


