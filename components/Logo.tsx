import Link from "next/link";

/** Marca "Vício em Dark Romance". */
export default function Logo({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2.5 ${className}`}>
      {/* selo com gota/coração estilizado */}
      <span className="relative grid h-9 w-9 place-items-center rounded-full ring-1 ring-champagne/30">
        <span className="absolute inset-0 rounded-full bg-blood-800/40 blur-[6px] transition-opacity duration-500 group-hover:opacity-100" />
        <span className="relative font-display text-lg font-black text-gilded">V</span>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[15px] font-bold tracking-wide text-white">
          Vício <span className="italic text-bloodied">em Dark</span>
        </span>
        <span className="block text-[9px] font-medium uppercase tracking-[0.34em] text-white/45">
          Romance Club
        </span>
      </span>
    </Link>
  );
}
