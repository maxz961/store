import { api } from "./api";
import type { User } from "@store/shared";

export async function getMe(): Promise<User | null> {
  try {
    return await api.get<User>("/auth/me");
  } catch {
    return null;
  }
}

export function getGoogleLoginUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  return `${apiUrl}/api/auth/google`;
}

export function getLogoutUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  return `${apiUrl}/api/auth/logout`;
}
