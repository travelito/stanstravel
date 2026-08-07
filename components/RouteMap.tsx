const stops = [
  { label: "Tashkent", x: 40, y: 40 },
  { label: "Samarkand", x: 200, y: 110 },
  { label: "Bukhara", x: 360, y: 70 },
  { label: "Khiva", x: 540, y: 40 },
];

/**
 * The route line is a real sequence — the order tourists actually travel
 * between these four cities — so numbered stops encode true information,
 * not decoration.
 */
export function RouteMap() {
  return (
    <svg
      viewBox="0 0 600 160"
      className="route-line w-full h-auto max-w-2xl"
      role="img"
      aria-label="Route: Tashkent, Samarkand, Bukhara, Khiva"
    >
      <path
        d={`M ${stops.map((s) => `${s.x} ${s.y}`).join(" L ")}`}
        fill="none"
        stroke="#C9A66B"
        strokeWidth="2"
      />
      {stops.map((s, i) => (
        <g key={s.label}>
          <circle cx={s.x} cy={s.y} r="16" fill="#1B3A5C" />
          <text
            x={s.x}
            y={s.y + 5}
            textAnchor="middle"
            fill="#F2EDE4"
            fontSize="12"
            fontFamily="var(--font-mono)"
          >
            {i + 1}
          </text>
          <text
            x={s.x}
            y={s.y + 34}
            textAnchor="middle"
            fill="#211D1A"
            fontSize="13"
            fontFamily="var(--font-body)"
          >
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
