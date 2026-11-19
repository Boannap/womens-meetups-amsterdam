import LandingPage from "@/components/LandingPage";
import { pageMeta } from "@/lib/meta";
import { LANDINGS, LANDING_ROUTES } from "@/lib/landings";

const t = LANDINGS.newcity.nl;
export const metadata = pageMeta("nl", LANDING_ROUTES.newcity, t.title, t.desc);

export default function Page() {
  return <LandingPage lang="nl" page="newcity" />;
}
