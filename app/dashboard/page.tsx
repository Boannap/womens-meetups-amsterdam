import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = { title: "Dashboard | Women's Meetups in Amsterdam", robots: { index: false, follow: false } };

export default function Page() {
  return <div lang="nl"><Dashboard /></div>;
}
