"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// [iso, dial, NL name, EN name]
const C: [string, string, string, string][] = [
  ["NL", "31", "Nederland", "Netherlands"], ["BE", "32", "België", "Belgium"], ["DE", "49", "Duitsland", "Germany"],
  ["GB", "44", "Verenigd Koninkrijk", "United Kingdom"], ["IE", "353", "Ierland", "Ireland"], ["FR", "33", "Frankrijk", "France"],
  ["ES", "34", "Spanje", "Spain"], ["PT", "351", "Portugal", "Portugal"], ["IT", "39", "Italië", "Italy"],
  ["CH", "41", "Zwitserland", "Switzerland"], ["AT", "43", "Oostenrijk", "Austria"], ["LU", "352", "Luxemburg", "Luxembourg"],
  ["DK", "45", "Denemarken", "Denmark"], ["SE", "46", "Zweden", "Sweden"], ["NO", "47", "Noorwegen", "Norway"],
  ["FI", "358", "Finland", "Finland"], ["PL", "48", "Polen", "Poland"], ["CZ", "420", "Tsjechië", "Czechia"],
  ["HU", "36", "Hongarije", "Hungary"], ["RO", "40", "Roemenië", "Romania"], ["BG", "359", "Bulgarije", "Bulgaria"],
  ["GR", "30", "Griekenland", "Greece"], ["HR", "385", "Kroatië", "Croatia"], ["SI", "386", "Slovenië", "Slovenia"],
  ["SK", "421", "Slowakije", "Slovakia"], ["LT", "370", "Litouwen", "Lithuania"], ["LV", "371", "Letland", "Latvia"],
  ["EE", "372", "Estland", "Estonia"], ["UA", "380", "Oekraïne", "Ukraine"], ["TR", "90", "Turkije", "Turkey"],
  ["US", "1", "Verenigde Staten", "United States"], ["CA", "1", "Canada", "Canada"], ["MX", "52", "Mexico", "Mexico"],
  ["BR", "55", "Brazilië", "Brazil"], ["AR", "54", "Argentinië", "Argentina"], ["CO", "57", "Colombia", "Colombia"],
  ["CL", "56", "Chili", "Chile"], ["SR", "597", "Suriname", "Suriname"], ["CW", "599", "Curaçao", "Curaçao"],
  ["AW", "297", "Aruba", "Aruba"], ["MA", "212", "Marokko", "Morocco"], ["EG", "20", "Egypte", "Egypt"],
  ["ZA", "27", "Zuid-Afrika", "South Africa"], ["NG", "234", "Nigeria", "Nigeria"], ["IN", "91", "India", "India"],
  ["PK", "92", "Pakistan", "Pakistan"], ["ID", "62", "Indonesië", "Indonesia"], ["PH", "63", "Filipijnen", "Philippines"],
  ["CN", "86", "China", "China"], ["JP", "81", "Japan", "Japan"], ["KR", "82", "Zuid-Korea", "South Korea"],
  ["SG", "65", "Singapore", "Singapore"], ["AE", "971", "Verenigde Arabische Emiraten", "United Arab Emirates"],
  ["IL", "972", "Israël", "Israel"], ["AU", "61", "Australië", "Australia"], ["NZ", "64", "Nieuw-Zeeland", "New Zealand"],
];
const flag = (iso: string) => String.fromCodePoint(...iso.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export default function PhoneInput({ lang, label }: { lang: "nl" | "en"; label: string }) {
  const [iso, setIso] = useState("NL");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [num, setNum] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const name = (c: (typeof C)[number]) => (lang === "nl" ? c[2] : c[3]);
  const cur = C.find((c) => c[0] === iso)!;
  const list = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^\+/, "");
    if (!s) return C;
    return C.filter((c) => name(c).toLowerCase().startsWith(s) || c[1].startsWith(s) || c[0].toLowerCase() === s)
      .concat(C.filter((c) => !name(c).toLowerCase().startsWith(s) && name(c).toLowerCase().includes(s)));
  }, [q, lang]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const h = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const pick = (c: (typeof C)[number]) => { setIso(c[0]); setOpen(false); setQ(""); };
  const local = num.replace(/[^0-9 ]/g, "").replace(/^\s*0+/, "");
  return (
    <div className="field full">
      <label className="l" htmlFor="fp">{label}</label>
      <div className="phone" ref={box}>
        <button type="button" className="phone-cc" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span>{flag(cur[0])}</span> +{cur[1]} <small>▾</small>
        </button>
        <input id="fp" type="tel" autoComplete="tel-national" inputMode="tel" placeholder={iso === "NL" ? "6 12345678" : ""}
          value={num} onChange={(e) => setNum(e.target.value)} pattern="[0-9 ()-]{6,16}" required />
        <input type="hidden" name="phone" value={local ? `+${cur[1]} ${local}` : ""} />
        {open && (
          <div className="phone-menu">
            <input autoFocus placeholder={lang === "nl" ? "Typ een land of code…" : "Type a country or code…"} value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (list[0]) pick(list[0]); } if (e.key === "Escape") setOpen(false); }} />
            <ul role="listbox">
              {list.map((c) => (
                <li key={c[0]} role="option" aria-selected={c[0] === iso} onClick={() => pick(c)}>
                  <span>{flag(c[0])}</span> {name(c)} <em>+{c[1]}</em>
                </li>
              ))}
              {list.length === 0 && <li className="none">{lang === "nl" ? "Niet gevonden" : "Not found"}</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
