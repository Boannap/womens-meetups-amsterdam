import PartnerPage, { PARTNER } from "@/components/PartnerPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("nl", { en: "/partners", nl: "/nl/samenwerken" }, PARTNER.nl.meta_title, PARTNER.nl.meta_desc);

export default function Page() {
  return <PartnerPage lang="nl" />;
}
