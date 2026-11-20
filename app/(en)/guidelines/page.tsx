import GuidelinesPage, { GUIDE } from "@/components/GuidelinesPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", { en: "/guidelines", nl: "/nl/huisregels" }, GUIDE.en.title, GUIDE.en.desc);

export default function Page() {
  return <GuidelinesPage lang="en" />;
}
