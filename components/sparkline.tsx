// Lightweight inline SVG sparkline — no chart lib, crisp at any width.
export function Sparkline({
  data,
  className,
  fillOpacity = 0.14,
}: {
  data: number[];
  className?: string;
  fillOpacity?: number;
}) {
  const w = 100;
  const h = 32;
  if (data.length < 2) {
    return <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden />;
  }

  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - 2 - ((v - min) / range) * (h - 4);
    return [x, y] as const;
  });

  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path d={area} fill="currentColor" opacity={fillOpacity} stroke="none" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
