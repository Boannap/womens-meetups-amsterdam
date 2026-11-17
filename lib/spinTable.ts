/**
 * Lets visitors spin the "Table of Six": drag with mouse or finger (with momentum),
 * page scrolling gives it a push, and otherwise it keeps turning slowly by itself.
 * Returns a cleanup function.
 */
export function spinTable(root: HTMLElement, reducedMotion = false): () => void {
  const g = root.querySelector<SVGGElement>("#tableSpin");
  const svg = root.querySelector<SVGSVGElement>("svg");
  if (!g || !svg) return () => {};
  const BASE = reducedMotion ? 0 : 0.15; // degrees per frame when idle (~1 turn / 40s)
  let angle = 0, vel = 0, dragging = false, lastA = 0, lastY = window.scrollY, raf = 0;

  const pointerAngle = (e: PointerEvent) => {
    const r = svg.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  const tick = () => {
    if (!dragging) {
      angle += BASE + vel;
      vel *= 0.95;
      if (Math.abs(vel) < 0.01) vel = 0;
    }
    g.setAttribute("transform", `rotate(${angle.toFixed(2)} 150 150)`);
    raf = requestAnimationFrame(tick);
  };
  const down = (e: PointerEvent) => {
    dragging = true; vel = 0; lastA = pointerAngle(e);
    svg.setPointerCapture(e.pointerId);
    root.classList.add("spinning");
  };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const a = pointerAngle(e);
    let d = a - lastA;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    angle += d; vel = d; lastA = a;
  };
  const up = () => { dragging = false; root.classList.remove("spinning"); };
  const onScroll = () => {
    const y = window.scrollY;
    const r = root.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) vel = Math.max(-2.5, Math.min(2.5, vel + (y - lastY) * 0.008));
    lastY = y;
  };

  svg.addEventListener("pointerdown", down);
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", up);
  svg.addEventListener("pointercancel", up);
  window.addEventListener("scroll", onScroll, { passive: true });
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    svg.removeEventListener("pointerdown", down);
    svg.removeEventListener("pointermove", move);
    svg.removeEventListener("pointerup", up);
    svg.removeEventListener("pointercancel", up);
    window.removeEventListener("scroll", onScroll);
  };
}
