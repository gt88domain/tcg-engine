// ---- Analysis helpers -------------------------------------------------------
import { createActor } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import type { Deck } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";

type CostBucket = { cost: number; count: number };

function getCostCurve(
  deck: Deck,
  cardMap: Map<bigint, { cost: bigint; cardType: string; tags: string[] }>,
): CostBucket[] {
  const buckets: Record<number, number> = {};
  for (const entry of deck.cards) {
    const card = cardMap.get(entry.cardId);
    if (!card) continue;
    const cost = Number(card.cost);
    buckets[cost] = (buckets[cost] ?? 0) + Number(entry.count);
  }
  return Array.from({ length: 7 }, (_, i) => ({
    cost: i,
    count: buckets[i] ?? 0,
  }));
}

function getTypeDist(
  deck: Deck,
  cardMap: Map<bigint, { cost: bigint; cardType: string; tags: string[] }>,
) {
  const dist: Record<string, number> = {};
  let total = 0;
  for (const entry of deck.cards) {
    const card = cardMap.get(entry.cardId);
    if (!card) continue;
    const count = Number(entry.count);
    dist[card.cardType] = (dist[card.cardType] ?? 0) + count;
    total += count;
  }
  return Object.entries(dist).map(([type, count]) => ({
    type,
    count,
    pct: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

function getRoleDist(
  deck: Deck,
  cardMap: Map<bigint, { cost: bigint; cardType: string; tags: string[] }>,
) {
  const roleMap: Record<string, string[]> = {
    Threat: ["Aggro", "Haste", "Trample", "Finisher"],
    Answer: ["Removal", "Answer", "Counter", "Sweeper"],
    Draw: ["Draw"],
    Resource: ["Resource", "Ramp"],
    Defense: ["Defense", "Control", "Defender"],
    Utility: ["Utility", "Recursion", "Buff", "Debuff"],
  };
  const dist: Record<string, number> = {};
  let total = 0;
  for (const entry of deck.cards) {
    const card = cardMap.get(entry.cardId);
    if (!card) continue;
    const count = Number(entry.count);
    let matched = false;
    for (const [role, keywords] of Object.entries(roleMap)) {
      if (card.tags.some((t) => keywords.includes(t))) {
        dist[role] = (dist[role] ?? 0) + count;
        matched = true;
        break;
      }
    }
    if (!matched) dist.Other = (dist.Other ?? 0) + count;
    total += count;
  }
  return Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .map(([role, count]) => ({
      role,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
}

const COST_COLORS = [
  "oklch(var(--primary)/0.25)",
  "oklch(var(--primary)/0.4)",
  "oklch(var(--primary)/0.55)",
  "oklch(var(--primary)/0.70)",
  "oklch(var(--primary)/0.85)",
  "oklch(var(--primary))",
  "oklch(var(--analysis-critical)/0.8)",
];

function CostCurveChart({ curve }: { curve: CostBucket[] }) {
  const max = Math.max(...curve.map((b) => b.count), 1);
  return (
    <div className="space-y-1" data-ocid="analysis.cost_curve">
      {curve.map((b, i) => (
        <div key={b.cost} className="flex items-center gap-2">
          <span className="w-4 text-right text-xs text-muted-foreground tabular-nums shrink-0">
            {b.cost}
          </span>
          <div className="flex-1 h-5 rounded bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded"
              style={{
                width: `${(b.count / max) * 100}%`,
                background: COST_COLORS[i] ?? COST_COLORS[6],
              }}
            />
          </div>
          <span className="w-4 text-xs tabular-nums text-muted-foreground shrink-0">
            {b.count}
          </span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground ml-6 mt-1">
        Mana cost (0–6+)
      </p>
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  Creature: "oklch(var(--status-published))",
  Spell: "oklch(var(--status-playtesting))",
  Artifact: "oklch(var(--info))",
};

function TypeDistChart({ dist }: { dist: ReturnType<typeof getTypeDist> }) {
  return (
    <div className="space-y-2" data-ocid="analysis.type_distribution">
      {dist.map((d) => (
        <div key={d.type} className="flex items-center gap-3">
          <span
            className="w-14 text-xs font-medium truncate"
            style={{
              color: TYPE_COLORS[d.type] ?? "oklch(var(--muted-foreground))",
            }}
          >
            {d.type}
          </span>
          <div className="flex-1 h-4 rounded bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded"
              style={{
                width: `${d.pct}%`,
                background:
                  TYPE_COLORS[d.type] ?? "oklch(var(--muted-foreground)/0.5)",
              }}
            />
          </div>
          <span className="w-14 text-xs tabular-nums text-right text-muted-foreground">
            {d.count} ({d.pct}%)
          </span>
        </div>
      ))}
    </div>
  );
}

const ROLE_COLORS: Record<string, string> = {
  Threat: "oklch(var(--analysis-critical)/0.8)",
  Answer: "oklch(var(--primary))",
  Draw: "oklch(var(--info))",
  Resource: "oklch(var(--status-published))",
  Defense: "oklch(var(--status-playtesting))",
  Utility: "oklch(var(--muted-foreground))",
  Other: "oklch(var(--muted-foreground)/0.5)",
};

function RoleDistChart({ dist }: { dist: ReturnType<typeof getRoleDist> }) {
  return (
    <div className="space-y-2" data-ocid="analysis.role_distribution">
      {dist.map((d) => (
        <div key={d.role} className="flex items-center gap-3">
          <span
            className="w-16 text-xs font-medium"
            style={{
              color: ROLE_COLORS[d.role] ?? "oklch(var(--muted-foreground))",
            }}
          >
            {d.role}
          </span>
          <div className="flex-1 h-4 rounded bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded"
              style={{
                width: `${d.pct}%`,
                background:
                  ROLE_COLORS[d.role] ?? "oklch(var(--muted-foreground)/0.4)",
              }}
            />
          </div>
          <span className="w-14 text-xs tabular-nums text-right text-muted-foreground">
            {d.count} ({d.pct}%)
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function AnalysisPage() {
  const { actor, isFetching } = useActor(createActor);

  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCards(BigInt(1));
    },
    enabled: !!actor && !isFetching,
  });

  const { data: decks = [], isLoading: decksLoading } = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDecks(null, BigInt(1));
    },
    enabled: !!actor && !isFetching,
  });

  const isLoading = cardsLoading || decksLoading;
  const targetDeck = decks.find((d) => d.name === "Midrange Value") ?? decks[0];
  const cardMap = new Map(
    cards.map((c) => [
      c.id,
      { cost: c.cost, cardType: c.cardType, tags: c.tags },
    ]),
  );

  const curve = targetDeck ? getCostCurve(targetDeck, cardMap) : [];
  const typeDist = targetDeck ? getTypeDist(targetDeck, cardMap) : [];
  const roleDist = targetDeck ? getRoleDist(targetDeck, cardMap) : [];
  const totalCards = targetDeck
    ? targetDeck.cards.reduce((s, e) => s + Number(e.count), 0)
    : 0;
  const avgCost =
    targetDeck && totalCards > 0
      ? (curve.reduce((s, b) => s + b.cost * b.count, 0) / totalCards).toFixed(
          1,
        )
      : "—";

  return (
    <div className="p-6 max-w-4xl space-y-6" data-ocid="analysis.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold">Deck Analysis</h1>
          {targetDeck && (
            <p className="text-sm text-muted-foreground mt-0.5">
              Showing:{" "}
              <span className="font-medium text-foreground">
                {targetDeck.name}
              </span>{" "}
              · {totalCards} cards
            </p>
          )}
        </div>
        {!isLoading && targetDeck && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Avg. cost</p>
            <p
              className="text-2xl font-display font-bold tabular-nums"
              style={{ color: "oklch(var(--primary))" }}
            >
              {avgCost}
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !targetDeck ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="analysis.empty_state"
        >
          <BarChart3 className="w-10 h-10 text-muted-foreground opacity-30 mb-3" />
          <p className="text-sm font-medium">No decks to analyse</p>
          <p className="text-xs text-muted-foreground mt-1">
            Build a deck in the Deck Builder first.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <SectionBlock title="Mana Cost Curve">
            <CostCurveChart curve={curve} />
          </SectionBlock>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionBlock title="Card Type Distribution">
              <TypeDistChart dist={typeDist} />
            </SectionBlock>
            <SectionBlock title="Role Distribution">
              <RoleDistChart dist={roleDist} />
            </SectionBlock>
          </div>
          <div
            className="rounded-xl border p-4"
            style={{
              background: "oklch(var(--info)/0.06)",
              borderColor: "oklch(var(--info)/0.25)",
            }}
            data-ocid="analysis.synergy_note"
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "oklch(var(--info))" }}
            >
              Coming soon
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Full synergy analysis — combo detection, simulated draws, mulligan
              rate, and the relationship map — is in development.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
