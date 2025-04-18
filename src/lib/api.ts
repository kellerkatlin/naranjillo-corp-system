const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const text = await res.text();

  if (!res.ok) {
    let errorMessage = "Error en la solicitud";
    try {
      const json = JSON.parse(text);
      errorMessage = json.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  if (text === "") {
    return undefined as T;
  }

  return JSON.parse(text);
}
