import PrivacyPage from "@/components/PrivacyPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("nl", { en: "/privacy", nl: "/nl/privacy" }, "Privacy & voorwaarden | Women's Meetups in Amsterdam");

export default function Page() {
  return <PrivacyPage lang="nl" />;
}
