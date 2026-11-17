/** Hand-drawn line illustrations (original), reused with <use href="#id"/>. */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={3.2} />
        </filter>
        <symbol id="heart" viewBox="0 0 24 24">
          <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="currentColor" />
        </symbol>
        <symbol id="cup" viewBox="0 0 200 200">
          <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path className="steam" d="M80 62c-11-12 11-20 0-36" />
            <path className="steam" d="M103 60c-11-12 11-20 0-36" />
            <path className="steam" d="M126 62c-11-12 11-20 0-36" />
            <path d="M50 84h114l-11 58c-3 16-16 27-32 27H93c-16 0-29-11-32-27z" />
            <path d="M161 98c24-5 31 24 3 33" />
            <path d="M28 178c44 11 116 11 156 0" />
            <path d="M72 102c3 18 6 30 13 42" />
          </g>
        </symbol>
        <symbol id="sparkle" viewBox="0 0 40 40">
          <path d="M20 2c1 10 5 15 18 18-13 3-17 8-18 18-1-10-5-15-18-18 13-3 17-8 18-18z" fill="currentColor" />
        </symbol>
        <symbol id="chair" viewBox="0 0 200 230">
          <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M58 20c0 40 1 70 5 102" /><path d="M142 20c0 40-1 70-5 102" />
            <path d="M58 22c28-11 56-11 84 0" /><path d="M60 50c27-9 53-9 80 0" /><path d="M62 78c25-7 51-7 76 0" />
            <ellipse cx="100" cy="124" rx="58" ry="15" />
            <path d="M48 128l-9 90" /><path d="M152 128l9 90" /><path d="M78 138l-5 80" /><path d="M122 138l5 80" />
            <path d="M52 178c32 9 64 9 96 0" />
            <path d="M84 92h30l-3 18c-1 4-4 6-8 6h-8c-4 0-7-2-8-6z" /><path d="M114 96c9 0 9 11 0 11" />
            <path className="steam" d="M94 84c-5-6 5-10 0-17" /><path className="steam" d="M104 84c-5-6 5-10 0-17" />
          </g>
        </symbol>
        <symbol id="hands" viewBox="0 0 220 160">
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 60h56l-6 40c-2 10-9 16-19 16h-6c-10 0-17-6-19-16z" /><path d="M95 70c14-2 16 18 2 20" /><path d="M8 150c10-20 22-34 40-40" />
            <path d="M124 60h56l-6 40c-2 10-9 16-19 16h-6c-10 0-17-6-19-16z" /><path d="M179 70c14-2 16 18 2 20" /><path d="M212 150c-10-20-22-34-40-40" />
            <path d="M98 40l6-10 6 10" /><path d="M110 20l4-12" /><path d="M96 22l-6-10" />
          </g>
        </symbol>
        <symbol id="cards" viewBox="0 0 200 150">
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="30" y="30" width="90" height="110" rx="12" transform="rotate(-12 75 85)" />
            <rect x="80" y="20" width="90" height="110" rx="12" transform="rotate(8 125 75)" />
            <path d="M110 60c8-14 34-10 30 6-3 10-16 10-16 24" /><circle cx="123" cy="104" r="2" fill="currentColor" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

export function Icon({ id, className, style }: { id: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}
