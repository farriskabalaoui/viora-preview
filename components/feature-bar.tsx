import { Marquee } from "@/components/marquee";

const items = [
  { icon: <BoxIcon />, text: "Manufactured & Packed in USA" },
  { icon: <BeakerIcon />, text: "Third-Party Batch Tested" },
  { icon: <TruckIcon />, text: "Fast Discreet Shipping" },
  { icon: <ChatIcon />, text: "24/7 AI-Powered Support" },
  { icon: <ShieldIcon />, text: "Physician-Backed Quality" },
  { icon: <CertIcon />, text: "≥99% HPLC Verified" },
];

export function FeatureBar() {
  return (
    <div className="bg-brand-dark text-brand-dark-foreground">
      <Marquee
        items={items}
        speed="normal"
        className="py-2.5"
        itemClassName="text-xs font-medium uppercase tracking-[0.12em] text-white/85"
      />
    </div>
  );
}

function BoxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8L12 3L3 8L12 13L21 8Z" />
      <path d="M3 8V16L12 21L21 16V8" />
      <line x1="12" y1="13" x2="12" y2="21" />
    </svg>
  );
}
function BeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M10 3v6L4 20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2L14 9V3" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="14" height="11" />
      <polygon points="15 11 22 11 22 17 15 17 15 11" />
      <circle cx="6" cy="20" r="2" />
      <circle cx="18" cy="20" r="2" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function CertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 13 11 15 15 11" />
    </svg>
  );
}
