import HostPage from "@/components/HostPage";
import { pageMeta } from "@/lib/meta";
import { dict } from "@/lib/site";

const t = dict("nl");
export const metadata = pageMeta("nl", { en: "/founder", nl: "/nl/founder" }, t.b_page_title, t.b_page_desc);

export default function Page() {
  return <HostPage lang="nl" />;
}
