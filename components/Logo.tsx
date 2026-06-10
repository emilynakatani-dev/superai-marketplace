/**
 * Project Mural mark — a pixel-art recreation of the speech-bubble cycle
 * (experts → agents → loop) with a central "M". Scales crisply; swap in the
 * exact raster at /public/project-mural-logo.png if you prefer the original.
 */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Project Mural"
      shapeRendering="crispEdges"
    >
      {/* top — cream speech bubble */}
      <g fill="#f5ecd6">
        <rect x="20" y="6" width="20" height="13" />
        <rect x="22" y="19" width="4" height="3" />
        <circle cx="26" cy="12.5" r="1.4" fill="#0b1322" />
        <circle cx="30" cy="12.5" r="1.4" fill="#0b1322" />
        <circle cx="34" cy="12.5" r="1.4" fill="#0b1322" />
      </g>
      {/* right — teal speech bubble */}
      <g fill="#2dd4bf">
        <rect x="45" y="22" width="16" height="12" />
        <rect x="47" y="34" width="3" height="3" />
        <circle cx="50" cy="28" r="1.2" fill="#04231f" />
        <circle cx="53.5" cy="28" r="1.2" fill="#04231f" />
        <circle cx="57" cy="28" r="1.2" fill="#04231f" />
      </g>
      {/* bottom — purple speech bubble */}
      <g fill="#a855f7">
        <rect x="22" y="44" width="18" height="12" />
        <rect x="24" y="56" width="3" height="3" />
        <circle cx="27" cy="50" r="1.3" fill="#1a0b2e" />
        <circle cx="31" cy="50" r="1.3" fill="#1a0b2e" />
        <circle cx="35" cy="50" r="1.3" fill="#1a0b2e" />
      </g>
      {/* left — red speech bubble */}
      <g fill="#f4513b">
        <rect x="3" y="30" width="13" height="11" />
        <rect x="5" y="41" width="3" height="3" />
        <circle cx="8" cy="35.5" r="1.3" fill="#2e0a06" />
        <circle cx="12" cy="35.5" r="1.3" fill="#2e0a06" />
      </g>
      {/* connecting cycle arrows */}
      <g fill="#f59e0b">
        <rect x="42" y="11" width="3" height="3" />
        <rect x="47" y="11" width="3" height="3" />
        <rect x="52" y="11" width="3" height="3" />
        <path d="M56 9 L61 12.5 L56 16 Z" />
      </g>
      <g fill="#2dd4bf">
        <rect x="25" y="37" width="3" height="3" />
        <rect x="20" y="37" width="3" height="3" />
        <path d="M19 35 L14 38.5 L19 42 Z" transform="translate(2 0)" />
      </g>
      <g fill="#f4513b">
        <rect x="9" y="24" width="3" height="3" />
        <rect x="9" y="28" width="3" height="3" />
        <path d="M10.5 22 L7 17 L14 17 Z" />
      </g>
      {/* center — orange M */}
      <g fill="#f59e0b">
        <rect x="26" y="26" width="3" height="12" />
        <rect x="35" y="26" width="3" height="12" />
        <rect x="29" y="28" width="3" height="3" />
        <rect x="32" y="28" width="3" height="3" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={30} />
      <span className="text-lg font-semibold tracking-tight text-white">
        Project <span className="text-accent-soft">Mural</span>
      </span>
    </span>
  );
}
