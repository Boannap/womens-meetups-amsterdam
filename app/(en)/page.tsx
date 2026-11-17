import Home from "@/components/Home";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", { en: "/", nl: "/nl" });

export default function Page() {
  return <Home lang="en" />;
}
