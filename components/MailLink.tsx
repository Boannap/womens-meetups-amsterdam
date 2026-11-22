"use client";

import { useState } from "react";

/** Opens the visitor's own mail app; if that doesn't work, they can copy the address with one tap. */
export default function MailLink({ email, lang }: { email: string; lang: "nl" | "en" }) {
  const [tried, setTried] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <span className="maillink">
      <a href={`mailto:${email}`} onClick={() => setTimeout(() => setTried(true), 600)}>{email}</a>
      {tried && (
        <small>
          {lang === "nl" ? "Opent er geen mail-app? " : "No mail app opening? "}
          <button type="button" onClick={() => { navigator.clipboard?.writeText(email).then(() => setCopied(true)).catch(() => {}); }}>
            {copied ? (lang === "nl" ? "Gekopieerd ✓" : "Copied ✓") : (lang === "nl" ? "Kopieer het adres" : "Copy the address")}
          </button>
          {" · "}
          <a href={`https://mail.google.com/mail/?view=cm&to=${email}`} target="_blank" rel="noopener">{lang === "nl" ? "open in Gmail" : "open in Gmail"}</a>
        </small>
      )}
    </span>
  );
}
