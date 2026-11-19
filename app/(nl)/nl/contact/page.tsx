import ContactPage, { CONTACT } from "@/components/ContactPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("nl", { en: "/contact", nl: "/nl/contact" }, CONTACT.nl.title, CONTACT.nl.desc);

export default function Page() {
  return <ContactPage lang="nl" />;
}
