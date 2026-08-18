import { Star } from "lucide-react";

/** Nota em estrelas (decorativo). */
export default function Stars({
  nota,
  size = 14,
  showValue = false,
}: {
  nota: number;
  size?: number;
  showValue?: boolean;
}) {
  const cheias = Math.round(nota);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < cheias
                ? "fill-champagne text-champagne"
                : "fill-transparent text-white/25"
            }
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-champagne">
          {nota.toFixed(1)}
        </span>
      )}
    </span>
  );
}
