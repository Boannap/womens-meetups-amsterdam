import PartnerPage, { PARTNER } from "@/components/PartnerPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", { en: "/partners", nl: "/nl/samenwerken" }, PARTNER.en.meta_title, PARTNER.en.meta_desc);

export default function Page() {
  return <PartnerPage lang="en" />;
}
