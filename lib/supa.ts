/** Tiny server-side helpers for Supabase REST with the publishable key (RLS + security-definer functions do the guarding). */
const url = () => process.env.SUPABASE_URL;
const key = () => process.env.SUPABASE_PUBLISHABLE_KEY || "";
const headers = () => {
  const k = key();
  return { apikey: k, ...(k.startsWith("sb_") ? {} : { Authorization: `Bearer ${k}` }), "Content-Type": "application/json" };
};
export const supaReady = () => !!url() && !!key();

export async function rpc<T = unknown>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  if (!supaReady()) return null;
  const res = await fetch(`${url()}/rest/v1/rpc/${fn}`, { method: "POST", headers: headers(), body: JSON.stringify(args), cache: "no-store" });
  if (!res.ok) { console.error("[rpc]", fn, res.status, await res.text()); return null; }
  return (await res.json()) as T;
}

export async function insert(table: string, rows: unknown[]) {
  if (!supaReady() || !rows.length) return false;
  const res = await fetch(`${url()}/rest/v1/${table}`, { method: "POST", headers: { ...headers(), Prefer: "return=minimal" }, body: JSON.stringify(rows) });
  if (!res.ok) console.error("[insert]", table, res.status, await res.text());
  return res.ok;
}
