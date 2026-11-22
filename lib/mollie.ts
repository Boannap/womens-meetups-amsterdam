/** Tiny Mollie client without extra packages. Needs MOLLIE_API_KEY (test_... for testing, live_... for real). */
export async function mollie<T = Record<string, unknown>>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const key = process.env.MOLLIE_API_KEY;
  if (!key) throw new Error("MOLLIE_API_KEY missing");
  const res = await fetch(`https://api.mollie.com/v2/${path}`, {
    method: init?.method ?? "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || `Mollie ${res.status}`);
  return data as T;
}
