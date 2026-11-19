import LandingPage from "@/components/LandingPage";
import { pageMeta } from "@/lib/meta";
import { LANDINGS, LANDING_ROUTES } from "@/lib/landings";

const t = LANDINGS.friends.en;
export const metadata = pageMeta("en", LANDING_ROUTES.friends, t.title, t.desc);

export default function Page() {
  return <LandingPage lang="en" page="friends" />;
}
