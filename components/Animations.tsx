"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { spinTable } from "@/lib/spinTable";
import { galleryHover } from "@/lib/galleryHover";

/** All GSAP motion lives here. Content is visible without JS; animations only add to it. */
export default function Animations() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector("header");
    const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hero reacts to mouse (hover) and finger (drag / tap). Uses the CSS `translate` and `rotate`
    // properties, so it stacks on top of the GSAP floating (which uses `transform`).
    const art = document.querySelector<HTMLElement>(".hero-art");
    const cleanups: (() => void)[] = [];
    if (art) {
      const depth: [string, number][] = [[".hero-photo", 10], ["#receipt", 18], ["#cardPink", -26], ["#cupHero", 32], [".hand-note", -14], ["[data-wiggle]", 44]];
      const items = depth.flatMap(([sel, d]) => Array.from(art.querySelectorAll<HTMLElement | SVGElement>(sel)).map((el) => [el, d] as const));
      const move = (e: PointerEvent) => {
        const r = art.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        items.forEach(([el, d]) => (el.style.translate = `${(dx * d).toFixed(1)}px ${(dy * d).toFixed(1)}px`));
      };
      const reset = () => items.forEach(([el]) => (el.style.translate = "0px 0px"));
      const down = (e: PointerEvent) => {
        move(e);
        const hit = items.map(([el]) => el).find((el) => {
          const b = el.getBoundingClientRect();
          return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
        });
        (hit ? [hit] : items.map(([el]) => el)).forEach((el) => {
          el.classList.remove("jiggle");
          void (el as HTMLElement).offsetWidth;
          el.classList.add("jiggle");
        });
      };
      art.addEventListener("pointermove", move);
      art.addEventListener("pointerleave", reset);
      art.addEventListener("pointercancel", reset);
      art.addEventListener("pointerdown", down);
      cleanups.push(() => {
        art.removeEventListener("pointermove", move);
        art.removeEventListener("pointerleave", reset);
        art.removeEventListener("pointercancel", reset);
        art.removeEventListener("pointerdown", down);
      });
    }

    const gallery = document.getElementById("galleryRow");
    if (gallery) cleanups.push(galleryHover(gallery));
    const table = document.getElementById("tableIll");
    if (table) cleanups.push(spinTable(table, window.matchMedia("(prefers-reduced-motion: reduce)").matches));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        window.removeEventListener("scroll", onScroll);
        cleanups.forEach((f) => f());
      };
    }
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const has = (sel: string) => document.querySelector(sel) !== null;
      const floaty = (sel: string, vars: gsap.TweenVars, delay: number) =>
        has(sel) && gsap.to(sel, { repeat: -1, yoyo: true, ease: "sine.inOut", delay, ...vars });

      if (has("#heroBig")) {
        gsap.from("#heroBig .w", { y: 80, rotate: () => gsap.utils.random(-12, 12), opacity: 0, duration: 0.9, stagger: 0.08, ease: "back.out(1.8)" });
        gsap.from(".hero .sub, .hero .lead, .hero .ctas, .hero .note, .eyebrow", { y: 20, opacity: 0, duration: 0.7, stagger: 0.08, delay: 0.35 });
        gsap.from(".hero-photo", { y: 70, rotate: -8, scale: 0.92, opacity: 0, duration: 1.1, delay: 0.15, ease: "back.out(1.4)" });
        gsap.from("#receipt", { y: -120, rotate: 18, opacity: 0, duration: 1.1, delay: 0.3, ease: "elastic.out(1,.7)" });
        gsap.from("#cardPink", { x: -80, rotate: -25, opacity: 0, duration: 1, delay: 0.5, ease: "back.out(1.5)" });
        gsap.from("#cupHero", { scale: 0, rotate: -30, duration: 0.9, delay: 0.8, ease: "back.out(2)" });
        gsap.from(".hand-note", { opacity: 0, x: -30, duration: 0.8, delay: 1 });
        // the hero composition keeps floating
        floaty(".hero-photo", { y: -10, rotate: 1.5, duration: 3.4 }, 1.3);
        floaty("#receipt", { y: -14, rotate: 1, duration: 2.6 }, 1.4);
        floaty("#cardPink", { y: 12, x: 6, rotate: -3, duration: 2.2 }, 1.5);
        floaty("#cupHero", { y: -10, rotate: 6, duration: 1.8 }, 1.7);
        floaty(".hand-note", { rotate: -3, scale: 1.06, duration: 1.5 }, 1.2);
        gsap.to(".hero-art", { y: -60, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      }
      if (has(".steam")) gsap.to(".steam", { y: -6, opacity: 0.35, duration: 1.4, repeat: -1, yoyo: true, stagger: 0.25, ease: "sine.inOut" });
      if (has("[data-wiggle]")) gsap.to("[data-wiggle]", { rotate: 20, scale: 1.15, duration: 1.6, repeat: -1, yoyo: true, stagger: 0.4, ease: "sine.inOut", transformOrigin: "50% 50%" });
      floaty("#portrait", { rotate: 2, y: -8, duration: 3 }, 0);
      if (has(".polaroid")) {
        gsap.utils.toArray<HTMLElement>(".polaroid").forEach((el, i) =>
          gsap.to(el, { y: i % 2 ? -10 : 10, duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: "sine.inOut" })
        );
        gsap.from(".polaroid", { y: 80, opacity: 0, duration: 0.8, stagger: 0.12, ease: "back.out(1.6)", scrollTrigger: { trigger: "#galleryRow", start: "top 85%" } });
      }

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el, i) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.4)", delay: (i % 4) * 0.08, scrollTrigger: { trigger: el, start: "top 88%" } })
      );
      if (has("#tableIll")) {
        gsap.from(".tcup", { opacity: 0, duration: 0.5, stagger: 0.12, scrollTrigger: { trigger: "#tableIll", start: "top 80%" } });
        // the table slowly keeps turning, the heart softly beats
        gsap.to("#tableHeart", { scale: 1.18, svgOrigin: "150 150", duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }
      if (has("#deck")) gsap.from(".qcard", { y: 80, opacity: 0, duration: 0.8, stagger: 0.12, ease: "back.out(1.5)", scrollTrigger: { trigger: "#deck", start: "top 80%" } });
      if (has(".closing")) {
        gsap.from("#chairEnd", { y: 60, rotate: -15, opacity: 0, duration: 1, ease: "elastic.out(1,.6)", scrollTrigger: { trigger: ".closing", start: "top 75%" } });
        gsap.from(".closing h2", { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.6)", scrollTrigger: { trigger: ".closing", start: "top 70%" } });
      }
    });

    // Page height changes (e.g. the form turns into the thank-you screen): recalculate scroll animations,
    // otherwise sections further down stay invisible.
    let rt: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 150); });
    ro.observe(document.body);
    cleanups.push(() => { ro.disconnect(); clearTimeout(rt); });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cleanups.forEach((f) => f());
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
