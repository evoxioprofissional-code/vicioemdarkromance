/** Cabeçalho de seção padrão (eyebrow + título + subtítulo). */
export default function SectionHeading({
  eyebrow,
  titulo,
  destaque,
  sub,
  center = true,
}: {
  eyebrow?: string;
  titulo: string;
  destaque?: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="eyebrow">
          <span className="h-px w-6 bg-champagne/50" /> {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[42px]">
        {titulo}{" "}
        {destaque && <span className="italic text-bloodied">{destaque}</span>}
      </h2>
      {sub && (
        <p className="mt-4 text-base leading-relaxed text-white/55">{sub}</p>
      )}
    </div>
  );
}
