import LandingPage from "@/components/LandingPage";
import { pageMeta } from "@/lib/meta";
import { LANDINGS, LANDING_ROUTES } from "@/lib/landings";

const t = LANDINGS.cafes.en;
export const metadata = pageMeta("en", LANDING_ROUTES.cafes, t.title, t.desc);

export default function Page() {
  return <LandingPage lang="en" page="cafes" />;
}
