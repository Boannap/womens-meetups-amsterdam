"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Link to a page that always lands at the top, also when you're already on that page (then it just scrolls up). */
export default function TopLink({ href, className, children, ...rest }: { href: string; className?: string; children: React.ReactNode; "aria-label"?: string }) {
  const path = usePathname();
  const same = (p: string) => p.replace(/\/$/, "") || "/";
  return (
    <Link href={href} scroll className={className} {...rest}
      onClick={(e) => { if (same(path) === same(href)) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>
      {children}
    </Link>
  );
}
