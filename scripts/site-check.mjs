// Checks the live site on phone sizes after every change (and daily).
// Fails if a page scrolls sideways, an image is broken, a page errors,
// or old/wrong wording shows up. Run: node scripts/site-check.mjs
import { chromium } from "playwright";

const SITES = {
  "https://womensmeetupsinamsterdam.com": [
    "/", "/contact", "/cosy-cafes-amsterdam", "/founder", "/guidelines", "/make-friends-in-amsterdam",
    "/meet-people-as-an-introvert", "/new-in-amsterdam", "/partners", "/privacy", "/photos",
  ],
  "https://womensmeetupsinamsterdam.nl": [
    "/", "/contact", "/founder", "/gezellige-cafes-amsterdam", "/huisregels", "/nieuw-in-amsterdam",
    "/nieuwe-mensen-ontmoeten-introvert", "/privacy", "/samenwerken", "/vriendinnen-maken-amsterdam",
  ],
};
const WIDTHS = [360, 390, 430, 1280];
// Wording that must never be on the site.
const BANNED = [/\b14[:.]00\b/, /vijf (leuke )?meiden/i, /five (lovely )?(girls|women)/i, /5x nieuwe vriendinnen/i, /—/];

const problems = [];
const browser = await chromium.launch();
for (const [base, paths] of Object.entries(SITES)) {
  for (const path of paths) {
    const url = base + path;
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, isMobile: width < 800 });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      let res;
      try { res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }); }
      catch (e) { problems.push(`${url} @${width}: laadt niet (${e.message.split("\n")[0]})`); await page.close(); continue; }
      if (!res || res.status() >= 400) problems.push(`${url}: status ${res?.status()}`);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(500);
      const r = await page.evaluate((W) => {
        const sw = document.documentElement.scrollWidth;
        const wide = [];
        if (sw > W + 1) {
          document.querySelectorAll("body *").forEach((e) => {
            const b = e.getBoundingClientRect();
            if (!b.width || (b.right <= W + 1 && b.left >= -1)) return;
            for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).overflowX !== "visible") return;
            wide.push(`${e.tagName.toLowerCase()}.${String(e.className).slice(0, 30)}`);
          });
        }
        const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src);
        return { sw, wide: wide.slice(0, 5), broken, text: document.body.innerText };
      }, width);
      if (r.sw > width + 1) problems.push(`${url} @${width}px: scrollt opzij (${r.sw}px breed) door ${r.wide.join(", ")}`);
      for (const b of r.broken) problems.push(`${url}: kapotte afbeelding ${b}`);
      if (width === 390) for (const re of BANNED) if (re.test(r.text)) problems.push(`${url}: verboden tekst ${re}`);
      for (const e of errors) problems.push(`${url} @${width}: scriptfout ${e.slice(0, 120)}`);
      await page.close();
    }
  }
}
await browser.close();
if (problems.length) { console.log("PROBLEMEN:\n" + [...new Set(problems)].join("\n")); process.exit(1); }
console.log("Alles in orde: geen zijwaarts scrollen, geen kapotte afbeeldingen, geen foute teksten.");
