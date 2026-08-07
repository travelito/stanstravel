const cities = [
  { label: "Khiva", x: 60, y: 90 },
  { label: "Bukhara", x: 190, y: 130 },
  { label: "Samarkand", x: 300, y: 150 },
  { label: "Shakhrisabz", x: 300, y: 200 },
  { label: "Tashkent", x: 420, y: 60 },
];

/** A simple orientation map — approximate relative positions, not survey-accurate. */
export function CityMap() {
  return (
    <svg
      viewBox="0 0 480 240"
      className="w-full h-auto max-w-2xl"
      role="img"
      aria-label="Map of Uzbekistan showing Khiva, Bukhara, Samarkand, Shakhrisabz, and Tashkent"
    >
      <rect x="0" y="0" width="480" height="240" rx="12" fill="#E4DCC9" />
      {cities.map((c) => (
        <g key={c.label}>
          <circle cx={c.x} cy={c.y} r="6" fill="#1B3A5C" />
          <circle cx={c.x} cy={c.y} r="10" fill="none" stroke="#2E9C97" strokeWidth="1.5" />
          <text
            x={c.x}
            y={c.y - 16}
            textAnchor="middle"
            fill="#211D1A"
            fontSize="12"
            fontFamily="var(--font-body)"
          >
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
