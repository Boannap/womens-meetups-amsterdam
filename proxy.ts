import { NextResponse, type NextRequest } from "next/server";

/**
 * womensmeetupsinamsterdam.nl shows the Dutch pages without the /nl prefix (/ -> /nl, /founder -> /nl/founder).
 * womensmeetupsinamsterdam.com shows the English pages; old /nl links there move to the .nl domain.
 * Other hosts (vercel.app, previews) keep the plain /, /nl routing.
 */
const NL_HOST = /(^|\.)womensmeetupsinamsterdam\.nl$/;
const COM_HOST = /(^|\.)womensmeetupsinamsterdam\.com$/;

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname, search } = req.nextUrl;
  const nlPath = pathname === "/nl" || pathname.startsWith("/nl/");

  if (NL_HOST.test(host)) {
    const url = req.nextUrl.clone();
    if (nlPath) {
      url.pathname = pathname.slice(3) || "/";
      return NextResponse.redirect(url, 308);
    }
    url.pathname = "/nl" + (pathname === "/" ? "" : pathname);
    return NextResponse.rewrite(url);
  }
  if (COM_HOST.test(host) && nlPath) {
    return NextResponse.redirect(`https://womensmeetupsinamsterdam.nl${pathname.slice(3) || "/"}${search}`, 308);
  }
  return NextResponse.next();
}

// Pages only: API routes, Next assets and files (sitemap.xml, robots.txt, images, llms.txt) pass straight through.
export const config = { matcher: ["/((?!api|_next|review|dashboard|.*\\..*).*)"] };
