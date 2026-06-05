import { apiFetch } from "./api";

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };

  accessToken: string;
  refreshToken: string;
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

export async function loginUser(email: string, password: string) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}
