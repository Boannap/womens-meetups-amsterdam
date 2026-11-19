import ContactPage, { CONTACT } from "@/components/ContactPage";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", { en: "/contact", nl: "/nl/contact" }, CONTACT.en.title, CONTACT.en.desc);

export default function Page() {
  return <ContactPage lang="en" />;
}
