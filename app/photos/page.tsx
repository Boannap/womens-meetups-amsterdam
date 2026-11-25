import type { Metadata } from "next";
import PhotoUpload from "@/components/PhotoUpload";

export const metadata: Metadata = { title: "Share your photos | Women's Meetups in Amsterdam", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const lang = sp.l === "nl" ? "nl" : "en";
  const endpoint = `${process.env.SUPABASE_URL ?? ""}/functions/v1/meetup-photos`;
  return (
    <div lang={lang} style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "40px 16px" }}>
      <PhotoUpload lang={lang} token={sp.r ?? ""} endpoint={endpoint} />
    </div>
  );
}
