import type { Metadata } from "next";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = { title: "Thank you | Women's Meetups in Amsterdam", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const lang = sp.l === "en" ? "en" : "nl";
  return (
    <div lang={lang} style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "40px 16px" }}>
      <ReviewForm lang={lang} token={sp.r ?? ""} saved={sp.saved === "1"} />
    </div>
  );
}
