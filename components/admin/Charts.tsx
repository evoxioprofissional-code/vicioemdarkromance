// Gráficos leves, sem bibliotecas — SVG + CSS. Todos decorativos/mock.

/** Gráfico de área/linha (tendência de receita). */
export function AreaChart({
  data,
  formatValor = (v) => String(v),
  altura = 220,
}: {
  data: { mes: string; valor: number }[];
  formatValor?: (v: number) => string;
  altura?: number;
}) {
  const w = 760;
  const h = altura;
  const padY = 24;
  const max = Math.max(...data.map((d) => d.valor)) * 1.1;
  const min = Math.min(...data.map((d) => d.valor)) * 0.85;
  const stepX = w / (data.length - 1);

  const px = (i: number) => i * stepX;
  const py = (v: number) =>
    h - padY - ((v - min) / (max - min)) * (h - padY * 2);

  const linha = data.map((d, i) => `${px(i)},${py(d.valor)}`).join(" ");
  const area = `M0,${h} L${data
    .map((d, i) => `${px(i)},${py(d.valor)}`)
    .join(" L")} L${w},${h} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full min-w-[560px]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c0303f" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#c0303f" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* linhas-guia horizontais */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1="0"
            x2={w}
            y1={padY + g * (h - padY * 2)}
            y2={padY + g * (h - padY * 2)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        <path d={area} fill="url(#areaFill)" />
        <polyline
          points={linha}
          fill="none"
          stroke="#d94452"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <g key={d.mes}>
            <circle cx={px(i)} cy={py(d.valor)} r="3.5" fill="#d9b26a" />
            <text
              x={px(i)}
              y={h - 4}
              textAnchor="middle"
              className="fill-white/40"
              style={{ fontSize: 11 }}
            >
              {d.mes}
            </text>
          </g>
        ))}

        {/* valor do último ponto */}
        <text
          x={px(data.length - 1)}
          y={py(data[data.length - 1].valor) - 12}
          textAnchor="end"
          className="fill-champagne"
          style={{ fontSize: 12, fontWeight: 700 }}
        >
          {formatValor(data[data.length - 1].valor)}
        </text>
      </svg>
    </div>
  );
}

/** Gráfico de barras verticais (novos assinantes por mês). */
export function BarChart({
  data,
}: {
  data: { mes: string; valor: number }[];
}) {
  const max = Math.max(...data.map((d) => d.valor));
  return (
    <div className="flex h-56 items-end gap-2">
      {data.map((d, i) => {
        const ultima = i === data.length - 1;
        return (
          <div key={d.mes} className="group flex flex-1 flex-col items-center gap-2">
            <span
              className={`text-[10px] font-semibold ${
                ultima ? "text-champagne" : "text-white/40 opacity-0 group-hover:opacity-100"
              } transition-opacity`}
            >
              {d.valor}
            </span>
            <div
              className={`w-full rounded-t-md transition-all ${
                ultima
                  ? "bg-gradient-to-t from-blood-800 to-blood-600 shadow-glow"
                  : "bg-white/10 group-hover:bg-blood-700/60"
              }`}
              style={{ height: `${(d.valor / max) * 100}%` }}
            />
            <span className="text-[10px] text-white/35">{d.mes}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Barras horizontais (origem das vendas / top livros). */
export function HBars({
  data,
  sufixo = "",
}: {
  data: { label: string; valor: number }[];
  sufixo?: string;
}) {
  const max = Math.max(...data.map((d) => d.valor));
  return (
    <ul className="space-y-3.5">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-white/70">{d.label}</span>
            <span className="font-semibold text-white">
              {d.valor}
              {sufixo}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blood-700 to-champagne"
              style={{ width: `${(d.valor / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
