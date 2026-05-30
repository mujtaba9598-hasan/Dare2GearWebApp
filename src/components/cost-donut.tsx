import type { CostBreakdown } from "@/lib/planner";
import { pkr } from "@/lib/format";

interface Segment {
  key: keyof Omit<CostBreakdown, "total">;
  label: string;
  color: string;
}

const SEGMENTS: Segment[] = [
  { key: "fuel", label: "Fuel", color: "#0d9488" },
  { key: "hotel", label: "Stay", color: "#f59e0b" },
  { key: "food", label: "Food", color: "#38bdf8" },
  { key: "misc", label: "Tolls & buffer", color: "#94a3b8" },
];

export function CostDonut({
  costs,
  size = 168,
}: {
  costs: CostBreakdown;
  size?: number;
}) {
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const total = costs.total || 1;

  const arcs = SEGMENTS.map((seg, i) => {
    const value = costs[seg.key];
    const fraction = value / total;
    const dash = fraction * circumference;
    // Offset = total length of all preceding segments (no mutation across renders).
    const precedingDash = SEGMENTS.slice(0, i).reduce(
      (sum, s) => sum + (costs[s.key] / total) * circumference,
      0,
    );
    return {
      ...seg,
      value,
      fraction,
      dashArray: `${dash} ${circumference - dash}`,
      dashOffset: -precedingDash,
    };
  });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={14}
          />
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={14}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-muted">Total</span>
          <span className="font-display text-xl font-bold text-ink">
            {pkr(costs.total)}
          </span>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
        {arcs.map((arc) => (
          <li key={arc.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: arc.color }}
              />
              {arc.label}
            </span>
            <span className="font-semibold text-ink tabular-nums">{pkr(arc.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
