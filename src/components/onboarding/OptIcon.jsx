// Onboarding variantlari uchun SVG ikonalar. `currentColor` orqali rang oladi.
const S = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true }
const stroke = { stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }
const fill = { fill: 'currentColor' }

const ICONS = {
  male: (
    <svg {...S}><circle cx="10" cy="14" r="5" {...stroke} /><path d="M15 9l5-5m0 0h-4m4 0v4" {...stroke} /></svg>
  ),
  female: (
    <svg {...S}><circle cx="12" cy="9" r="5" {...stroke} /><path d="M12 14v7m-3-3h6" {...stroke} /></svg>
  ),
  other: (
    <svg {...S}><circle cx="11" cy="13" r="4.5" {...stroke} /><path d="M14.5 9.5L19 5m0 0h-3.5M19 5v3.5M9 20h4m-2-2v4" {...stroke} /></svg>
  ),
  crown: (
    <svg {...S}><path d="M4 8l3 4 5-6 5 6 3-4v9H4V8Z" {...stroke} /></svg>
  ),
  heart: (
    <svg {...S}><path d="M12 20S3.5 14.5 3.5 8.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.5 1.8C20.5 14.5 12 20 12 20Z" {...fill} /></svg>
  ),
  briefcase: (
    <svg {...S}><rect x="3" y="7" width="18" height="12" rx="2" {...stroke} /><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" {...stroke} /></svg>
  ),
  people: (
    <svg {...S}><circle cx="8" cy="9" r="2.6" {...stroke} /><circle cx="16" cy="9" r="2.6" {...stroke} /><path d="M3.5 19c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M13 15c.8-.6 1.9-1 3-1 2.5 0 4.5 1.5 4.5 4" {...stroke} /></svg>
  ),
  signalHigh: (
    <svg {...S}><rect x="4" y="13" width="3.4" height="7" rx="1" {...fill} /><rect x="10.3" y="9" width="3.4" height="11" rx="1" {...fill} /><rect x="16.6" y="5" width="3.4" height="15" rx="1" {...fill} /></svg>
  ),
  signalMid: (
    <svg {...S}><rect x="4" y="13" width="3.4" height="7" rx="1" {...fill} /><rect x="10.3" y="9" width="3.4" height="11" rx="1" {...fill} /><rect x="16.6" y="5" width="3.4" height="15" rx="1" fill="currentColor" opacity="0.3" /></svg>
  ),
  signalLow: (
    <svg {...S}><rect x="4" y="13" width="3.4" height="7" rx="1" {...fill} /><rect x="10.3" y="9" width="3.4" height="11" rx="1" fill="currentColor" opacity="0.3" /><rect x="16.6" y="5" width="3.4" height="15" rx="1" fill="currentColor" opacity="0.3" /></svg>
  ),
  chatPlus: (
    <svg {...S}><path d="M4 5h16v11H9l-5 4V5Z" {...stroke} /><path d="M12 8v5m-2.5-2.5h5" {...stroke} /></svg>
  ),
  eye: (
    <svg {...S}><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" {...stroke} /><circle cx="12" cy="12" r="2.6" {...stroke} /></svg>
  ),
  megaphone: (
    <svg {...S}><path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1Z" {...stroke} /><path d="M18 9a4 4 0 0 1 0 6" {...stroke} /></svg>
  ),
  book: (
    <svg {...S}><path d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0V5Z" {...stroke} /><path d="M20 5c-2-1-5-1-8 0v14c3-1 6-1 8 0V5Z" {...stroke} /></svg>
  ),
  smile: (
    <svg {...S}><circle cx="12" cy="12" r="9" {...stroke} /><path d="M8.5 14a4 4 0 0 0 7 0" {...stroke} /><circle cx="9" cy="10" r="1" {...fill} /><circle cx="15" cy="10" r="1" {...fill} /></svg>
  ),
  balance: (
    <svg {...S}><circle cx="12" cy="12" r="9" {...stroke} /><path d="M12 3a9 9 0 0 0 0 18 4.5 9 0 0 1 0-18Z" {...fill} /></svg>
  ),
  search: (
    <svg {...S}><circle cx="11" cy="11" r="6.5" {...stroke} /><path d="M16 16l4 4" {...stroke} /></svg>
  ),
  seed: (
    <svg {...S}><path d="M12 21v-7" {...stroke} /><path d="M12 14c0-3 2-5 5-5 0 3-2 5-5 5ZM12 15c0-2.5-1.7-4.5-4.5-4.5 0 2.8 1.7 4.5 4.5 4.5Z" {...fill} /></svg>
  ),
  leaf: (
    <svg {...S}><path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13Z" {...fill} /><path d="M8 16c3-3 6-5 9-6" stroke="#0c0908" strokeWidth="1.4" strokeLinecap="round" /></svg>
  ),
  tree: (
    <svg {...S}><path d="M12 3l5 7h-3l4 6H6l4-6H7l5-7Z" {...fill} /><path d="M12 22v-6" {...stroke} /></svg>
  ),
  alarm: (
    <svg {...S}><circle cx="12" cy="13" r="7" {...stroke} /><path d="M12 10v3l2 2M5 5l3 2m11-2l-3 2" {...stroke} /></svg>
  ),
  brain: (
    <svg {...S}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.5A3 3 0 0 0 8 17a2.5 2.5 0 0 0 4 1V5a2.5 2.5 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.5A3 3 0 0 1 16 17a2.5 2.5 0 0 1-4 1" {...stroke} /></svg>
  ),
  trophy: (
    <svg {...S}><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" {...stroke} /><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 20h6m-3-4v4" {...stroke} /></svg>
  ),
  target: (
    <svg {...S}><circle cx="12" cy="12" r="8.5" {...stroke} /><circle cx="12" cy="12" r="4.5" {...stroke} /><circle cx="12" cy="12" r="1.2" {...fill} /></svg>
  ),
  bulb: (
    <svg {...S}><path d="M9 18h6M10 21h4" {...stroke} /><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.5 1-2.1A6 6 0 0 0 12 3Z" {...stroke} /></svg>
  ),
  fingerprint: (
    <svg {...S}><path d="M12 4a8 8 0 0 0-8 8M20 12a8 8 0 0 0-4-6.9M7 12a5 5 0 0 1 10 0v2M9.5 12a2.5 2.5 0 0 1 5 0v3M12 15v4M7 15v2M17 16v2" {...stroke} /></svg>
  ),
}

export default function OptIcon({ name }) {
  return ICONS[name] || <svg {...S}><circle cx="12" cy="12" r="8" {...stroke} /></svg>
}
