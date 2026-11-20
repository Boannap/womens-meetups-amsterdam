import GuidelinesPage, { GUIDE } from "@/components/GuidelinesPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("nl", { en: "/guidelines", nl: "/nl/huisregels" }, GUIDE.nl.title, GUIDE.nl.desc);

export default function Page() {
  return <GuidelinesPage lang="nl" />;
}
