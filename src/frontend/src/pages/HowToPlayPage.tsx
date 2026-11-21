import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Shield,
  Swords,
  Zap,
} from "lucide-react";
import { useState } from "react";

const PHASE_INFO: Array<{
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
}> = [
  {
    id: "Start",
    name: "Start Phase",
    icon: <Zap className="w-4 h-4" />,
    desc: "Mana refills to your maximum. Start-of-turn abilities (e.g. Verdant Healer) trigger here.",
  },
  {
    id: "Draw",
    name: "Draw Phase",
    icon: <BookOpen className="w-4 h-4" />,
    desc: "Draw one card from your library. If your library is empty when you must draw, you lose.",
  },
  {
    id: "Main",
    name: "Main Phase",
    icon: <Swords className="w-4 h-4" />,
    desc: "Play cards by spending Mana. Creatures, Spells, and Artifacts all enter play here. Enter-play abilities resolve immediately.",
  },
  {
    id: "Combat",
    name: "Combat Phase",
    icon: <Flame className="w-4 h-4" />,
    desc: "Declare attackers. Opponent assigns blockers. Damage is simultaneous. Creatures at 0 defense are destroyed.",
  },
  {
    id: "End",
    name: "End Phase",
    icon: <Shield className="w-4 h-4" />,
    desc: "Discard down to 7 cards. End-of-turn effects and temporary stat boosts expire.",
  },
];

const CARD_TYPES = [
  {
    name: "Creature",
    color: "oklch(var(--status-published))",
    bg: "oklch(var(--status-published)/0.1)",
    desc: "Stays in play. Can attack and block. Has Attack/Defense. Reduced to 0 defense = destroyed.",
  },
  {
    name: "Spell",
    color: "oklch(var(--status-playtesting))",
    bg: "oklch(var(--status-playtesting)/0.1)",
    desc: "One-time effect. Resolves then goes to the graveyard. Cannot block or attack.",
  },
  {
    name: "Artifact",
    color: "oklch(var(--info))",
    bg: "oklch(var(--info)/0.1)",
    desc: "Stays in play like a creature but has no Attack/Defense. Provides passive or triggered resource effects.",
  },
];

const KEYWORDS = [
  { name: "Flying", desc: "Can only be blocked by creatures with Flying." },
  {
    name: "Defender",
    desc: "Cannot attack. Compensated with high Defense or powerful passive effects.",
  },
  {
    name: "Haste",
    desc: "Can attack the turn it enters play. Normal creatures have Summoning Sickness for one turn.",
  },
  {
    name: "Trample",
    desc: "Excess combat damage above a blocker's Defense is dealt to the opponent.",
  },
  {
    name: "Lifesteal",
    desc: "When this creature deals damage, heal that same amount.",
  },
];

const TIPS = [
  "Play Mana Siphon or Leyline Conduit early to ramp into big threats faster.",
  "Flying creatures are hard to block \u2014 use Galewind Hawk or Aether Sphinx for consistent pressure.",
  "Save removal like Arc Lightning or Wither Curse for your opponent's most dangerous creature.",
  "Crystal Golem and Iron Warden hold off aggro decks while you build your board.",
  "Watch open Mana during your opponent's Main phase \u2014 they might have a counter-spell.",
  "If you're behind on board, a well-timed Inferno Wave can reset the game.",
];

function Section({
  title,
  children,
  index,
}: { title: string; children: React.ReactNode; index: number }) {
  const [open, setOpen] = useState(index < 3);
  return (
    <div
      className="rounded-xl border border-border overflow-hidden"
      data-ocid={`how_to_play.section.${index}`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/40 transition-colors duration-150 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-ocid={`how_to_play.toggle.${index}`}
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronRight
          className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-150"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 py-4 bg-muted/20 border-t border-border">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowToPlayPage() {
  return (
    <div className="p-6 max-w-3xl space-y-4" data-ocid="how_to_play.page">
      <div className="mb-2">
        <h1 className="text-xl font-display font-bold">
          How to Play — Aura TCG
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          A strategic card game of elemental power and tactical combat.
        </p>
      </div>

      <Section title="Overview & Goal" index={0}>
        <div className="space-y-3">
          <p className="text-sm text-foreground">
            Aura TCG is a two-player card game. Each player starts with{" "}
            <strong>20 life</strong> and a deck of 20–60 cards. Reduce your
            opponent's life to zero to win.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Starting Life", value: "20" },
              { label: "Mana Per Turn", value: "2" },
              { label: "Max Hand Size", value: "7" },
              { label: "Min Deck Size", value: "20" },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-lg bg-muted/30 px-3 py-2 flex items-center justify-between"
              >
                <span className="text-xs text-muted-foreground">
                  {row.label}
                </span>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Turn Structure" index={1}>
        <ol className="space-y-3">
          {PHASE_INFO.map((phase, i) => (
            <li key={phase.id} className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold tabular-nums mt-0.5"
                style={{
                  background: "oklch(var(--primary)/0.12)",
                  color: "oklch(var(--primary))",
                }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <span style={{ color: "oklch(var(--primary))" }}>
                    {phase.icon}
                  </span>
                  {phase.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Card Types" index={2}>
        <div className="space-y-3">
          {CARD_TYPES.map((ct) => (
            <div
              key={ct.name}
              className="flex items-start gap-3 rounded-lg p-3"
              style={{ background: ct.bg }}
            >
              <span
                className="px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5"
                style={{ color: ct.color, border: `1px solid ${ct.color}` }}
              >
                {ct.name}
              </span>
              <p className="text-xs text-foreground leading-relaxed">
                {ct.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Keyword Glossary" index={3}>
        <div className="space-y-2">
          {KEYWORDS.map((kw) => (
            <div
              key={kw.name}
              className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/30"
              data-ocid={`how_to_play.keyword.${kw.name.toLowerCase()}`}
            >
              <Badge
                className="text-xs shrink-0 mt-0.5"
                style={{
                  background: "oklch(var(--primary)/0.15)",
                  color: "oklch(var(--primary))",
                  border: "none",
                }}
              >
                {kw.name}
              </Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {kw.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How to Win" index={4}>
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Flame
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "oklch(var(--analysis-critical))" }}
            />
            <div>
              <p className="text-sm font-semibold">Life to Zero</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deal damage until your opponent reaches 0 life via attacking
                creatures or damage spells.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <BookOpen
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "oklch(var(--status-playtesting))" }}
            />
            <div>
              <p className="text-sm font-semibold">Deck Out</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                A player who cannot draw on their Draw Phase loses immediately.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Strategy Tips" index={5}>
        <ul className="space-y-2">
          {TIPS.map((tip, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static tip list
            <li key={i} className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums"
                style={{
                  background: "oklch(var(--primary)/0.12)",
                  color: "oklch(var(--primary))",
                }}
              >
                {i + 1}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tip}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
