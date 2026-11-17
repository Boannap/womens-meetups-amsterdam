import PrivacyPage from "@/components/PrivacyPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", { en: "/privacy", nl: "/nl/privacy" }, "Privacy & terms | Women's Meetups in Amsterdam");

export default function Page() {
  return <PrivacyPage lang="en" />;
}
