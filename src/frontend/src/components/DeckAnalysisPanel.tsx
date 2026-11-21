import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DeckEntryLocal } from "@/hooks/useDecks";
import { cn } from "@/lib/utils";
import type { Card, DeckValidation, ResourceSystem } from "@/types";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// CSS variable reader — safe for SSR, returns fallback if unavailable
function cssVar(name: string): string {
  if (typeof window === "undefined") return "#888";
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    "#888"
  );
}

function tok(name: string): string {
  const v = cssVar(name);
  if (v.startsWith("#") || v.startsWith("rgb") || v.startsWith("oklch"))
    return v;
  return `oklch(${v})`;
}

const ROLE_VARS: Record<string, string> = {
  threat: "--card-threat",
  answer: "--card-answer",
  draw: "--card-draw",
  resource: "--card-resource",
  disruption: "--card-disruption",
  defense: "--card-defense",
  utility: "--card-utility",
  finisher: "--card-finisher",
};

const TYPE_COLORS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
];

function getRoleColor(role: string): string {
  const key = role.toLowerCase();
  return tok(ROLE_VARS[key] ?? "--muted-foreground");
}

// ─── Role detection from ability effects ─────────────────────────────────────────────

export function detectRole(card: Card): string {
  for (const ability of card.abilities) {
    for (const effect of ability.effects) {
      switch (effect.__kind__) {
        case "DealDamage":
          return "threat";
        case "DrawCards":
          return "draw";
        case "GainResources":
          return "resource";
        case "HealLife":
          return "defense";
        case "Destroy":
          return "disruption";
        case "StatBoostUntilEOT":
          return "utility";
        default:
          break;
      }
    }
  }
  return "utility";
}

// ─── Analysis computations ──────────────────────────────────────────────────────────────────

function buildCostCurve(cards: Card[]): { cost: string; count: number }[] {
  const bins: Record<string, number> = {};
  for (let i = 0; i <= 7; i++) bins[String(i)] = 0;
  bins["8+"] = 0;
  for (const c of cards) {
    const cost = Number(c.cost);
    const key = cost >= 8 ? "8+" : String(cost);
    bins[key] = (bins[key] ?? 0) + 1;
  }
  return Object.entries(bins).map(([cost, count]) => ({ cost, count }));
}

function buildTypeDistribution(
  cards: Card[],
): { type: string; count: number; pct: number }[] {
  const total = cards.length;
  if (total === 0) return [];
  const counts: Record<string, number> = {};
  for (const c of cards) counts[c.cardType] = (counts[c.cardType] ?? 0) + 1;
  return Object.entries(counts)
    .map(([type, count]) => ({
      type,
      count,
      pct: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

function buildRoleDistribution(
  cards: Card[],
): { role: string; count: number }[] {
  if (cards.length === 0) return [];
  const counts: Record<string, number> = {};
  for (const c of cards) {
    const role = detectRole(c);
    counts[role] = (counts[role] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);
}

function avgCost(cards: Card[]): string {
  if (cards.length === 0) return "—";
  const sum = cards.reduce((s, c) => s + Number(c.cost), 0);
  return (sum / cards.length).toFixed(1);
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded px-2 py-1 text-xs text-foreground shadow-sm">
      <span className="font-mono tabular-nums">
        {label}: {payload[0]?.value ?? 0}
      </span>
    </div>
  );
}

// ─── Panel Props ─────────────────────────────────────────────────────────────────────────

export interface DeckAnalysisPanelProps {
  /** New preferred API: flat array with card + count */
  cards?: Array<{ card: Card; count: number }>;
  /** Legacy API: entries + cardMap (used internally by DeckBuilderPage) */
  entries?: DeckEntryLocal[];
  cardMap?: Map<bigint, Card>;
  resourceSystem?: ResourceSystem;
  validation: DeckValidation;
  className?: string;
}

// ─── Main Component ────────────────────────────────────────────────────────────────────────

export function DeckAnalysisPanel({
  cards: cardsProp,
  entries,
  cardMap,
  resourceSystem,
  validation,
  className,
}: DeckAnalysisPanelProps) {
  const minSize = resourceSystem ? Number(resourceSystem.deckSizeMin) : 20;
  const maxSize = resourceSystem ? Number(resourceSystem.deckSizeMax) : 60;

  // Resolve flat cards array from either prop API
  const cards = useMemo(() => {
    if (cardsProp) {
      const result: Card[] = [];
      for (const { card, count } of cardsProp) {
        for (let i = 0; i < count; i++) result.push(card);
      }
      return result;
    }
    if (entries && cardMap) {
      const result: Card[] = [];
      for (const e of entries) {
        const card = cardMap.get(e.cardId);
        if (card) for (let i = 0; i < e.count; i++) result.push(card);
      }
      return result;
    }
    return [];
  }, [cardsProp, entries, cardMap]);

  const costCurve = useMemo(() => buildCostCurve(cards), [cards]);
  const typeData = useMemo(() => buildTypeDistribution(cards), [cards]);
  const roleData = useMemo(() => buildRoleDistribution(cards), [cards]);
  const totalCards = cards.length;
  const mostCommonType = typeData[0]?.type ?? "—";

  return (
    <div
      data-ocid="deck.analysis_panel"
      className={cn(
        "flex flex-col gap-4 bg-card border-l border-border h-full overflow-y-auto",
        className,
      )}
    >
      {/* Stats Summary */}
      <section className="px-4 pt-4 pb-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Summary
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Cards" value={`${totalCards}/${maxSize}`} />
          <Stat label="Avg Cost" value={avgCost(cards)} />
          <Stat label="Top Type" value={mostCommonType} small />
        </div>
        {totalCards < minSize && (
          <p className="text-[10px] text-destructive mt-2">
            Need {minSize - totalCards} more card
            {minSize - totalCards !== 1 ? "s" : ""} (min {minSize})
          </p>
        )}
      </section>

      <Separator />

      {/* Cost Curve */}
      <section className="px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Cost Curve
        </h3>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={costCurve}
            margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
          >
            <XAxis
              dataKey="cost"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={false} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {costCurve.map((entry) => (
                <Cell
                  key={entry.cost}
                  fill={"oklch(var(--primary))"}
                  fillOpacity={entry.count > 0 ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      <Separator />

      {/* Type Distribution */}
      <section className="px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Type Distribution
        </h3>
        {typeData.length === 0 ? (
          <p className="text-xs text-muted-foreground">No cards yet</p>
        ) : (
          <div className="space-y-1.5">
            {typeData.map((d, i) => (
              <TypeBar
                key={d.type}
                label={d.type}
                count={d.count}
                pct={d.pct}
                colorVar={TYPE_COLORS[i % TYPE_COLORS.length]}
              />
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Role Distribution */}
      <section className="px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Role Distribution
        </h3>
        {roleData.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Add cards with abilities to see roles
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={80} height={80}>
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="count"
                  cx="50%"
                  cy="50%"
                  innerRadius={22}
                  outerRadius={38}
                  strokeWidth={0}
                >
                  {roleData.map((entry) => (
                    <Cell key={entry.role} fill={getRoleColor(entry.role)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 min-w-0">
              {roleData.map((d) => (
                <div key={d.role} className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="shrink-0 w-2 h-2 rounded-full"
                    style={{ background: getRoleColor(d.role) }}
                  />
                  <span className="text-xs capitalize text-foreground truncate">
                    {d.role}
                  </span>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground font-mono">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* Format Validation */}
      <section className="px-4 pb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Format
        </h3>
        {validation.isValid ? (
          <div
            data-ocid="deck.validation_success"
            className="flex items-center gap-2 text-sm"
            style={{ color: "oklch(var(--analysis-good))" }}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Deck is valid</span>
          </div>
        ) : (
          <ul data-ocid="deck.validation_errors" className="space-y-1.5">
            {validation.errors.map((err, i) => (
              <li
                key={`${err.slice(0, 20)}-${i}`}
                className="flex items-start gap-2 text-xs"
                style={{ color: "oklch(var(--analysis-critical))" }}
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{err}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono tabular-nums font-semibold text-foreground",
          small ? "text-sm truncate" : "text-base",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function TypeBar({
  label,
  count,
  pct,
  colorVar,
}: {
  label: string;
  count: number;
  pct: number;
  colorVar: string;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs">
        <span className="text-foreground capitalize">{label}</span>
        <span className="tabular-nums font-mono text-muted-foreground">
          {count} <span className="text-[10px]">({pct}%)</span>
        </span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: `oklch(var(${colorVar}))` }}
        />
      </div>
    </div>
  );
}

// ─── Sparkline for DeckCard ────────────────────────────────────────────────────────────────

export function CostCurveSparkline({ cards }: { cards: Card[] }) {
  const data = useMemo(() => buildCostCurve(cards), [cards]);
  return (
    <ResponsiveContainer width="100%" height={32}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="count" radius={[1, 1, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.cost}
              fill={"oklch(var(--primary))"}
              fillOpacity={entry.count > 0 ? 0.9 : 0.2}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
