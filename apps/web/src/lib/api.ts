const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}
