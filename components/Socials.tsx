import { BOANNA_SOCIALS } from "@/lib/site";

const ICONS: Record<string, React.ReactNode> = {
  Instagram: (<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>),
  YouTube: (<><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" /></>),
};

/** Boanna's own channels. */
export default function Socials({ label }: { label: string }) {
  return (
    <div className="socials">
      <span className="lbl">{label}</span>
      {BOANNA_SOCIALS.map((s) => (
        <a key={s.name} className="social" href={s.url} target="_blank" rel="noopener me" aria-label={`${s.name} ${s.handle}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[s.name]}</svg>
          {s.handle}
        </a>
      ))}
    </div>
  );
}
