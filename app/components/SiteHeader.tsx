const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

function Sprout() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 43V23M24 29C8 30 5 17 7 7c13 0 22 7 17 22ZM24 22C23 8 34 4 43 5c0 12-6 20-19 17Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shared site header used across the Groundwork pages. */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href={`${BASE}/`}>
        <Sprout />
        groundwork<span className="brand-dot">.</span>
      </a>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a className="header-link" href={`${BASE}/#demo`}>Live Demo <span>↗</span></a>
        <a className="header-link" href={`${BASE}/map`}>Find Locations <span>↗</span></a>
        <a className="header-link" href={`${BASE}/drop-off`}>Log Drop-Off <span>↗</span></a>
        <a className="header-link" href={`${BASE}/compost-tracker`}>Track Impact <span>↗</span></a>
      </div>
    </header>
  );
}
