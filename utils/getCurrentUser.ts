// utils/getCurrentUser.ts

export interface DecodedUser {
  user: any;
  id: number;
  name?: string;
  email: string;
  role_id?: number;
}

export async function getCurrentUser(): Promise<DecodedUser | null> {
  try {
    const res = await fetch("/api/me", {
      method: "GET",
      credentials: "include", // penting untuk kirim cookie
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error("Failed to get current user:", err);
    return null;
  }
}
