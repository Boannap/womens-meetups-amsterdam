/**
 * Original top-down "Table of Six" illustration: six hands, six drinks (coffee & tea), one table.
 * Returns an SVG string so the preview and the Next.js site share exactly the same drawing.
 * The group #tableSpin is rotated slowly by GSAP; #tableHeart pulses.
 */
export function tableSvg(): string {
  const C = { wine: "#8E1B2C", tomato: "#E4472F", pink: "#E58FA3", blue: "#4F7DB8", green: "#4E6B3A", orange: "#D9652B" };
  const arm = (c: string) =>
    `<path d="M-15 20C-18 34-16 46-12 58" stroke="${c}"/><path d="M15 20C19 34 17 46 13 58" stroke="${c}"/>` +
    `<path d="M16 14c9-3 12 5 5 10" stroke="${c}"/><path d="M-16 16c-6 2-6 8-1 9" stroke="${c}"/>`;
  const drinks: [string, string][] = [
    // cappuccino with latte-art heart
    [C.wine, `<circle r="27" fill="#FCF8F1"/><circle r="20" fill="${C.wine}" fill-opacity=".18"/><path d="M0 8s-9-6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12-9 12z" fill="${C.wine}" fill-opacity=".55" stroke="none"/><path d="M-27 -4c-10-2-10 10 0 8"/>`],
    // tea with lemon slice and tea bag string
    [C.tomato, `<circle r="22" fill="${C.tomato}" fill-opacity=".14"/><circle cx="-5" cy="-4" r="8"/><path d="M-5 -12v16M-13 -4h16M-11 -10l12 12M1 -10l-12 12" stroke-width="2.5"/><path d="M10 -15c4-6 1-12 5-17"/><rect x="9" y="-44" width="11" height="12" rx="2" fill="${C.tomato}" fill-opacity=".3"/>`],
    // iced coffee with ice cubes and a straw
    [C.blue, `<circle r="21" fill="${C.blue}" fill-opacity=".12"/><rect x="-11" y="-9" width="9" height="9" rx="2" transform="rotate(-15 -6 -4)"/><rect x="2" y="-2" width="9" height="9" rx="2" transform="rotate(20 6 2)"/><path d="M4 -6l18 -26" stroke-width="5"/>`],
    // matcha bowl with foam
    [C.green, `<circle r="24"/><circle r="17" fill="${C.green}" fill-opacity=".3"/><path d="M-9 -2c3-3 6 3 9 0s6 3 9 0M-7 6c3-3 6 3 9 0s5 3 7 0" stroke-width="2.5"/>`],
    // espresso on a saucer
    [C.orange, `<circle r="23" fill="#FCF8F1"/><circle r="13" fill="${C.orange}" fill-opacity=".35"/><path d="M13 -2c8-1 8 7 0 6"/><circle cx="-14" cy="12" r="3" fill="${C.orange}" stroke="none"/>`],
    // chai with cinnamon stick
    [C.pink, `<circle r="22" fill="${C.pink}" fill-opacity=".18"/><path d="M-22 -2c-10-1-10 11 0 9"/><path d="M-6 -14l16 26M0 -16l16 26" stroke-width="3"/><circle cx="-8" cy="8" r="2.5" fill="${C.pink}" stroke="none"/><circle cx="6" cy="-4" r="2" fill="${C.pink}" stroke="none"/>`],
  ];
  let s = `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="filter:url(#wobble)" aria-hidden="true"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.8">`;
  s += `<circle cx="150" cy="150" r="122" stroke="#5A0F14" stroke-width="6" fill="#FCF8F1"/><g id="tableSpin">`;
  drinks.forEach(([c, inner], i) => {
    const a = i * 60 - 90;
    const r = (a * Math.PI) / 180;
    const x = (150 + 72 * Math.cos(r)).toFixed(1);
    const y = (150 + 72 * Math.sin(r)).toFixed(1);
    s += `<g class="tcup" transform="translate(${x} ${y}) rotate(${a - 90})" stroke="${c}">${arm(c)}${inner}</g>`;
  });
  s += `</g><path id="tableHeart" d="M150 160s-12-8-12-16a7 7 0 0 1 12-4 7 7 0 0 1 12 4c0 8-12 16-12 16z" fill="#E4472F" stroke="none"/></g></svg>`;
  return s;
}
