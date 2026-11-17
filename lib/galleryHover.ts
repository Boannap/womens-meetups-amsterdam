/**
 * Polaroids react to the mouse: they drift toward the cursor and the nearest one lifts up.
 * On touch, a tap makes the photo jiggle. Uses the CSS `translate` property so it stacks
 * with the GSAP floating (transform) and the CSS `rotate` tilt. Returns a cleanup function.
 */
export function galleryHover(root: HTMLElement): () => void {
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".polaroid"));
  if (!cards.length) return () => {};
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cards.forEach((c) => {
      const b = c.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / 420); // 1 = cursor on the card
      c.style.translate = `${(dx * 0.05).toFixed(1)}px ${(dy * 0.04 - near * 22).toFixed(1)}px`;
      c.style.zIndex = near > 0.6 ? "2" : "";
    });
  };
  const reset = () => cards.forEach((c) => { c.style.translate = "0px 0px"; c.style.zIndex = ""; });
  const tap = (e: PointerEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".polaroid");
    if (!card) return;
    card.classList.remove("jiggle");
    void card.offsetWidth;
    card.classList.add("jiggle");
  };
  root.addEventListener("pointermove", move);
  root.addEventListener("pointerleave", reset);
  root.addEventListener("pointerdown", tap);
  return () => {
    root.removeEventListener("pointermove", move);
    root.removeEventListener("pointerleave", reset);
    root.removeEventListener("pointerdown", tap);
  };
}
