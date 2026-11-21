import type {
  Ability,
  AbilityEffect,
  Card,
  CardTypeDefinition,
  GameDefinition,
  KeywordDefinition,
} from "@/backend";
import {
  AbilityTarget,
  AbilityTrigger,
  Variant_freeform_structured,
} from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCard, useDeleteCard, useUpdateCard } from "@/hooks/useCards";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Flag,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CardPreview, type cardToPreviewData } from "./CardPreview";
type _CardPreviewData = ReturnType<typeof cardToPreviewData>;
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Rarity = "Common" | "Uncommon" | "Rare" | "Legendary";

const RARITY_OPTIONS: { value: Rarity; label: string; dot: string }[] = [
  { value: "Common", label: "Common", dot: "oklch(var(--rarity-common))" },
  {
    value: "Uncommon",
    label: "Uncommon",
    dot: "oklch(var(--rarity-uncommon))",
  },
  { value: "Rare", label: "Rare", dot: "oklch(var(--rarity-rare))" },
  {
    value: "Legendary",
    label: "Legendary",
    dot: "oklch(var(--rarity-mythic))",
  },
];

function setRarityInTags(tags: string[], rarity: Rarity | null): string[] {
  const base = tags.filter((t) => !t.startsWith("rarity:"));
  if (rarity) return [...base, `rarity:${rarity}`];
  return base;
}

function _getRarityFromTags(tags: string[]): Rarity | null {
  const r = tags.find((t) => t.startsWith("rarity:"));
  if (!r) return null;
  return r.replace("rarity:", "") as Rarity;
}

function _formToTags(form: CardFormState): string[] {
  const base = form.tags.filter((t) => !t.startsWith("rarity:"));
  if (form.rarity) return [...base, `rarity:${form.rarity}`];
  return base;
}

interface CardFormState {
  name: string;
  cost: string;
  attack: string;
  defense: string;
  cardType: string;
  tags: string[];
  tagInput: string;
  rulesText: string;
  flavourText: string;
  artUrl: string;
  abilities: Ability[];
  rarity: Rarity | null;
}

const DEFAULT_FORM: CardFormState = {
  name: "",
  cost: "0",
  attack: "",
  defense: "",
  cardType: "",
  tags: [],
  tagInput: "",
  rulesText: "",
  flavourText: "",
  artUrl: "",
  abilities: [],
  rarity: null,
};

function cardToForm(card: Card): CardFormState {
  const rarityTag = card.tags.find((t) => t.startsWith("rarity:"));
  const rarity = rarityTag
    ? (rarityTag.replace("rarity:", "") as Rarity)
    : null;
  return {
    name: card.name,
    cost: String(card.cost),
    attack: card.attack !== undefined ? String(card.attack) : "",
    defense: card.defense !== undefined ? String(card.defense) : "",
    cardType: card.cardType,
    tags: card.tags.filter((t) => !t.startsWith("rarity:")),
    tagInput: "",
    rulesText: card.rulesText ?? "",
    flavourText: card.flavourText ?? "",
    artUrl: card.artUrl ?? "",
    abilities: card.abilities.map((a) => ({
      ...a,
      effects: [...a.effects],
      targets: [...a.targets],
    })),
    rarity,
  };
}

const TRIGGER_OPTIONS: { value: AbilityTrigger; label: string }[] = [
  { value: AbilityTrigger.EnterPlay, label: "When this enters play" },
  { value: AbilityTrigger.Attacks, label: "When this attacks" },
  { value: AbilityTrigger.DealsDamage, label: "When this deals damage" },
  { value: AbilityTrigger.StartOfTurn, label: "At start of your turn" },
  { value: AbilityTrigger.EndOfTurn, label: "At end of your turn" },
  { value: AbilityTrigger.Destroyed, label: "When this is destroyed" },
  { value: AbilityTrigger.Activated, label: "Activated: pay cost" },
  { value: AbilityTrigger.Passive, label: "Passive (always active)" },
];

const TARGET_OPTIONS: { value: AbilityTarget; label: string }[] = [
  { value: AbilityTarget.TargetCreature, label: "Target creature" },
  { value: AbilityTarget.TargetPlayer, label: "Target player" },
  { value: AbilityTarget.AllCreatures, label: "All creatures" },
  {
    value: AbilityTarget.AllOpponentCreatures,
    label: "All opponent's creatures",
  },
  { value: AbilityTarget.AllYourCreatures, label: "All your creatures" },
  { value: AbilityTarget.Opponent, label: "Opponent" },
  { value: AbilityTarget.You, label: "You" },
  { value: AbilityTarget.ThisCard, label: "This card" },
  { value: AbilityTarget.NoTarget, label: "No target" },
];

type EffectKind = AbilityEffect["__kind__"];

const EFFECT_OPTIONS: { value: EffectKind; label: string }[] = [
  { value: "DealDamage", label: "Deal X damage" },
  { value: "HealLife", label: "Heal X life" },
  { value: "DrawCards", label: "Draw X cards" },
  { value: "GainResources", label: "Gain X resources this turn" },
  { value: "StatBoostUntilEOT", label: "+X/+Y stat boost until end of turn" },
  {
    value: "StatReduceUntilEOT",
    label: "-X/-Y stat reduction until end of turn",
  },
  { value: "Destroy", label: "Destroy target" },
  { value: "ReturnToHand", label: "Return to hand" },
  { value: "Counter", label: "Counter (negate)" },
  { value: "GiveKeyword", label: "Give keyword" },
  { value: "CustomEffect", label: "Custom effect (manual)" },
];

function makeDefaultEffect(kind: EffectKind): AbilityEffect {
  switch (kind) {
    case "DealDamage":
      return { __kind__: "DealDamage", DealDamage: 1n };
    case "HealLife":
      return { __kind__: "HealLife", HealLife: 1n };
    case "DrawCards":
      return { __kind__: "DrawCards", DrawCards: 1n };
    case "GainResources":
      return { __kind__: "GainResources", GainResources: 1n };
    case "StatBoostUntilEOT":
      return { __kind__: "StatBoostUntilEOT", StatBoostUntilEOT: [1n, 0n] };
    case "StatReduceUntilEOT":
      return { __kind__: "StatReduceUntilEOT", StatReduceUntilEOT: [1n, 0n] };
    case "Destroy":
      return { __kind__: "Destroy", Destroy: null };
    case "ReturnToHand":
      return { __kind__: "ReturnToHand", ReturnToHand: null };
    case "Counter":
      return { __kind__: "Counter", Counter: null };
    case "GiveKeyword":
      return { __kind__: "GiveKeyword", GiveKeyword: "" };
    case "CustomEffect":
      return { __kind__: "CustomEffect", CustomEffect: "" };
  }
}

function effectLabel(
  effect: AbilityEffect,
  keywords: KeywordDefinition[],
): string {
  switch (effect.__kind__) {
    case "DealDamage":
      return `Deal ${effect.DealDamage} damage`;
    case "HealLife":
      return `Heal ${effect.HealLife} life`;
    case "DrawCards":
      return `Draw ${effect.DrawCards} card${effect.DrawCards > 1n ? "s" : ""}`;
    case "GainResources":
      return `Gain ${effect.GainResources} resources`;
    case "StatBoostUntilEOT":
      return `+${effect.StatBoostUntilEOT[0]}/+${effect.StatBoostUntilEOT[1]} until EOT`;
    case "StatReduceUntilEOT":
      return `-${effect.StatReduceUntilEOT[0]}/-${effect.StatReduceUntilEOT[1]} until EOT`;
    case "Destroy":
      return "Destroy target";
    case "ReturnToHand":
      return "Return to hand";
    case "Counter":
      return "Counter (negate)";
    case "GiveKeyword": {
      const kw = keywords.find((k) => k.id === effect.GiveKeyword);
      return `Give keyword: ${(kw?.name ?? effect.GiveKeyword) || "?"}`;
    }
    case "CustomEffect":
      return effect.CustomEffect || "Custom effect";
  }
}

function abilityIsManual(ability: Ability): boolean {
  return (
    ability.effects.some((e) => e.__kind__ === "CustomEffect") ||
    !!ability.conditionText
  );
}

function abilitySentence(
  ability: Ability,
  keywords: KeywordDefinition[],
): string {
  const triggerOpt = TRIGGER_OPTIONS.find((t) => t.value === ability.trigger);
  const targetOpt = TARGET_OPTIONS.find((t) =>
    ability.targets.includes(t.value),
  );
  const effects = ability.effects
    .map((e) => effectLabel(e, keywords))
    .join(", ");
  const parts: string[] = [];
  if (triggerOpt) parts.push(triggerOpt.label);
  if (effects) parts.push(effects);
  if (targetOpt) parts.push(`on ${targetOpt.label}`);
  return parts.join(" → ") || ability.name || "New ability";
}

function EffectEditor({
  effect,
  keywords,
  onChange,
  onRemove,
}: {
  effect: AbilityEffect;
  keywords: KeywordDefinition[];
  onChange: (e: AbilityEffect) => void;
  onRemove: () => void;
}) {
  const kind = effect.__kind__;
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <select
        value={kind}
        onChange={(e) =>
          onChange(makeDefaultEffect(e.target.value as EffectKind))
        }
        className="h-7 text-xs rounded border border-input bg-background px-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label="Effect type"
      >
        {EFFECT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {(kind === "DealDamage" ||
        kind === "HealLife" ||
        kind === "DrawCards" ||
        kind === "GainResources") && (
        <Input
          type="number"
          min="0"
          className="h-7 w-16 text-xs tabular-nums"
          value={String(
            kind === "DealDamage"
              ? effect.DealDamage
              : kind === "HealLife"
                ? effect.HealLife
                : kind === "DrawCards"
                  ? effect.DrawCards
                  : effect.GainResources,
          )}
          onChange={(ev) => {
            const n = BigInt(Math.max(0, Number(ev.target.value) || 0));
            if (kind === "DealDamage")
              onChange({ __kind__: "DealDamage", DealDamage: n });
            else if (kind === "HealLife")
              onChange({ __kind__: "HealLife", HealLife: n });
            else if (kind === "DrawCards")
              onChange({ __kind__: "DrawCards", DrawCards: n });
            else onChange({ __kind__: "GainResources", GainResources: n });
          }}
        />
      )}

      {(kind === "StatBoostUntilEOT" || kind === "StatReduceUntilEOT") && (
        <>
          <Input
            type="number"
            min="0"
            placeholder="X"
            className="h-7 w-14 text-xs tabular-nums"
            value={String(
              kind === "StatBoostUntilEOT"
                ? effect.StatBoostUntilEOT[0]
                : effect.StatReduceUntilEOT[0],
            )}
            onChange={(ev) => {
              const n = BigInt(Math.max(0, Number(ev.target.value) || 0));
              const cur =
                kind === "StatBoostUntilEOT"
                  ? effect.StatBoostUntilEOT
                  : effect.StatReduceUntilEOT;
              if (kind === "StatBoostUntilEOT")
                onChange({
                  __kind__: "StatBoostUntilEOT",
                  StatBoostUntilEOT: [n, cur[1]],
                });
              else
                onChange({
                  __kind__: "StatReduceUntilEOT",
                  StatReduceUntilEOT: [n, cur[1]],
                });
            }}
          />
          <span className="text-muted-foreground">/</span>
          <Input
            type="number"
            min="0"
            placeholder="Y"
            className="h-7 w-14 text-xs tabular-nums"
            value={String(
              kind === "StatBoostUntilEOT"
                ? effect.StatBoostUntilEOT[1]
                : effect.StatReduceUntilEOT[1],
            )}
            onChange={(ev) => {
              const n = BigInt(Math.max(0, Number(ev.target.value) || 0));
              const cur =
                kind === "StatBoostUntilEOT"
                  ? effect.StatBoostUntilEOT
                  : effect.StatReduceUntilEOT;
              if (kind === "StatBoostUntilEOT")
                onChange({
                  __kind__: "StatBoostUntilEOT",
                  StatBoostUntilEOT: [cur[0], n],
                });
              else
                onChange({
                  __kind__: "StatReduceUntilEOT",
                  StatReduceUntilEOT: [cur[0], n],
                });
            }}
          />
        </>
      )}

      {kind === "GiveKeyword" &&
        (keywords.length > 0 ? (
          <select
            value={effect.GiveKeyword}
            onChange={(e) =>
              onChange({ __kind__: "GiveKeyword", GiveKeyword: e.target.value })
            }
            className="h-7 text-xs rounded border border-input bg-background px-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Keyword"
          >
            <option value="">Select keyword…</option>
            {keywords.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>
        ) : (
          <Input
            placeholder="Keyword name"
            className="h-7 w-32 text-xs"
            value={effect.GiveKeyword}
            onChange={(e) =>
              onChange({ __kind__: "GiveKeyword", GiveKeyword: e.target.value })
            }
          />
        ))}

      {kind === "CustomEffect" && (
        <Input
          placeholder="Describe the effect…"
          className="h-7 flex-1 min-w-[120px] text-xs"
          value={effect.CustomEffect}
          onChange={(ev) =>
            onChange({
              __kind__: "CustomEffect",
              CustomEffect: ev.target.value,
            })
          }
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="ml-auto text-muted-foreground hover:text-destructive"
        aria-label="Remove effect"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// replaced by abilitySentence + effectLabel

// removed — replaced by ability summary rows

const _ART_SWATCHES = [
  {
    id: "gradient-teal",
    label: "Teal",
    value:
      "linear-gradient(135deg, oklch(0.45 0.18 195), oklch(0.65 0.12 210))",
  },
  {
    id: "gradient-crimson",
    label: "Crimson",
    value: "linear-gradient(135deg, oklch(0.42 0.22 25), oklch(0.60 0.16 40))",
  },
  {
    id: "gradient-violet",
    label: "Violet",
    value:
      "linear-gradient(135deg, oklch(0.40 0.20 285), oklch(0.58 0.14 300))",
  },
  {
    id: "gradient-amber",
    label: "Amber",
    value: "linear-gradient(135deg, oklch(0.60 0.18 75), oklch(0.75 0.14 90))",
  },
  {
    id: "gradient-forest",
    label: "Forest",
    value:
      "linear-gradient(135deg, oklch(0.38 0.15 145), oklch(0.55 0.12 160))",
  },
  {
    id: "gradient-slate",
    label: "Slate",
    value:
      "linear-gradient(135deg, oklch(0.35 0.04 240), oklch(0.52 0.03 250))",
  },
  {
    id: "gradient-rose",
    label: "Rose",
    value:
      "linear-gradient(135deg, oklch(0.55 0.20 340), oklch(0.70 0.14 355))",
  },
  {
    id: "gradient-gold",
    label: "Gold",
    value: "linear-gradient(135deg, oklch(0.55 0.15 55), oklch(0.72 0.12 70))",
  },
];

function AbilityRow({
  ability,
  index,
  keywords,
  onChange,
  onRemove,
}: {
  ability: Ability;
  index: number;
  keywords: KeywordDefinition[];
  onChange: (a: Ability) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isManual = abilityIsManual(ability);
  const sentence = abilitySentence(ability, keywords);

  const toggleTarget = (t: AbilityTarget) => {
    const targets = ability.targets.includes(t)
      ? ability.targets.filter((x) => x !== t)
      : [...ability.targets, t];
    onChange({ ...ability, targets });
  };

  return (
    <div
      className="border border-border rounded-md overflow-hidden"
      data-ocid={`ability.item.${index + 1}`}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30">
        <button
          type="button"
          className="flex-1 text-left flex items-center gap-2 min-w-0"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="text-xs text-foreground truncate min-w-0">
            {sentence}
          </span>
          {isManual && (
            <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-warning font-mono">
              <Flag size={10} /> manual
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground hover:text-foreground shrink-0"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0"
          aria-label="Remove ability"
          data-ocid={`ability.delete_button.${index + 1}`}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {expanded && (
        <div className="p-3 flex flex-col gap-3 border-t border-border/60">
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Ability Name</Label>
            <Input
              className="h-7 text-xs"
              value={ability.name}
              placeholder="e.g. Battle Cry"
              onChange={(e) => onChange({ ...ability, name: e.target.value })}
              data-ocid={`ability.name_input.${index + 1}`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Trigger</Label>
            <select
              value={ability.trigger ?? ""}
              onChange={(e) =>
                onChange({
                  ...ability,
                  trigger: (e.target.value as AbilityTrigger) || undefined,
                })
              }
              className="h-7 text-xs rounded border border-input bg-background px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid={`ability.trigger_select.${index + 1}`}
            >
              <option value="">Select trigger…</option>
              {TRIGGER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Target(s)</Label>
            <div className="flex flex-wrap gap-1">
              {TARGET_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggleTarget(o.value)}
                  className={cn(
                    "text-[11px] font-mono px-2 py-0.5 rounded border",
                    ability.targets.includes(o.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50",
                  )}
                  data-ocid={`ability.target.${o.value.toLowerCase()}.${index + 1}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Effects</Label>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...ability,
                    effects: [
                      ...ability.effects,
                      makeDefaultEffect("DealDamage"),
                    ],
                  })
                }
                className="flex items-center gap-1 text-[11px] font-mono text-primary hover:text-primary/80"
                data-ocid={`ability.add_effect_button.${index + 1}`}
              >
                <Plus size={10} /> Add effect
              </button>
            </div>
            {ability.effects.length === 0 && (
              <p className="text-[11px] text-muted-foreground">
                No effects yet.
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              {ability.effects.map((eff, ei) => (
                <EffectEditor
                  key={`${ability.id}-${ei}`}
                  effect={eff}
                  keywords={keywords}
                  onChange={(updated) => {
                    const effects = [...ability.effects];
                    effects[ei] = updated;
                    onChange({ ...ability, effects });
                  }}
                  onRemove={() =>
                    onChange({
                      ...ability,
                      effects: ability.effects.filter((_, i) => i !== ei),
                    })
                  }
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">
              Condition{" "}
              <span className="text-muted-foreground font-normal">
                (optional — adds manual flag)
              </span>
            </Label>
            <Input
              className="h-7 text-xs"
              placeholder="If [condition]…"
              value={ability.conditionText ?? ""}
              onChange={(e) =>
                onChange({
                  ...ability,
                  conditionText: e.target.value || undefined,
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Type</Label>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...ability,
                  abilityType:
                    ability.abilityType ===
                    Variant_freeform_structured.structured
                      ? Variant_freeform_structured.freeform
                      : Variant_freeform_structured.structured,
                })
              }
              className={cn(
                "text-[11px] font-mono px-2 py-0.5 rounded border",
                ability.abilityType === Variant_freeform_structured.structured
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {ability.abilityType === Variant_freeform_structured.structured
                ? "Structured"
                : "Freeform"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardEditorPanelProps {
  card?: Card | null;
  gameDefinition?: GameDefinition | null;
  onClose?: () => void;
  onSaved?: (card: Card) => void;
  onDeleted?: () => void;
}

export function CardEditorPanel({
  card,
  gameDefinition,
  onClose,
  onSaved,
  onDeleted,
}: CardEditorPanelProps) {
  const isNew = !card;
  const [form, setForm] = useState<CardFormState>(
    card ? cardToForm(card) : DEFAULT_FORM,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof CardFormState, string>>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const abilityCounterRef = useRef(0);

  useEffect(() => {
    setForm(card ? cardToForm(card) : DEFAULT_FORM);
    setErrors({});
    setShowDeleteConfirm(false);
  }, [card]);

  const cardTypes = gameDefinition?.cardTypes ?? [];

  function set<K extends keyof CardFormState>(key: K, value: CardFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof CardFormState, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    const costNum = Number(form.cost);
    if (Number.isNaN(costNum) || costNum < 0 || costNum > 10)
      errs.cost = "Cost must be 0-10.";
    if (!form.cardType) errs.cardType = "Card type is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    const cost = BigInt(Number(form.cost));
    const attack = form.attack !== "" ? BigInt(Number(form.attack)) : undefined;
    const defense =
      form.defense !== "" ? BigInt(Number(form.defense)) : undefined;
    const tags = setRarityInTags(form.tags, form.rarity);
    try {
      let saved: Card;
      if (isNew) {
        saved = await createCard.mutateAsync({
          name: form.name.trim(),
          cost,
          attack,
          defense,
          cardType: form.cardType,
          tags,
          rulesText: form.rulesText || undefined,
          flavourText: form.flavourText || undefined,
          artUrl: form.artUrl || undefined,
          abilities: form.abilities,
        });
      } else {
        saved = await updateCard.mutateAsync({
          id: card.id,
          name: form.name.trim(),
          cost,
          attack: attack ?? null,
          defense: defense ?? null,
          cardType: form.cardType,
          tags,
          rulesText: form.rulesText || null,
          flavourText: form.flavourText || null,
          artUrl: form.artUrl || null,
          abilities: form.abilities,
        });
      }
      onSaved?.(saved);
    } catch (_) {
      // error displayed by mutation state
    }
  }

  async function handleDelete() {
    if (!card) return;
    await deleteCard.mutateAsync(card.id);
    onDeleted?.();
  }

  function addTag() {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    set("tagInput", "");
  }

  function addAbility() {
    abilityCounterRef.current += 1;
    const newAbility: Ability = {
      id: BigInt(abilityCounterRef.current),
      name: "",
      abilityType: Variant_freeform_structured.structured,
      trigger: undefined,
      targets: [],
      effects: [],
      rulesText: undefined,
      conditionText: undefined,
    };
    set("abilities", [...form.abilities, newAbility]);
  }

  const isSaving = createCard.isPending || updateCard.isPending;
  const mutationError = createCard.error?.message ?? updateCard.error?.message;

  const previewData = {
    name: form.name,
    cost: Number(form.cost) || 0,
    cardType: form.cardType,
    attack: form.attack !== "" ? Number(form.attack) : undefined,
    defense: form.defense !== "" ? Number(form.defense) : undefined,
    rulesText: form.rulesText,
    flavourText: form.flavourText,
    artUrl: form.artUrl,
    abilities: form.abilities,
  };

  return (
    <div
      className="flex flex-col h-full bg-card border-l border-border"
      data-ocid="card-editor.panel"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h2 className="font-display font-semibold text-sm">
          {isNew ? "New Card" : `Edit: ${card.name}`}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close editor"
            data-ocid="card-editor.close_button"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Identity */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Identity
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1">
                <Label htmlFor="card-name" className="text-xs">
                  Name *
                </Label>
                <Input
                  id="card-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Storm Drake"
                  className={cn("h-8", errors.name && "border-destructive")}
                  data-ocid="card-editor.name_input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="card-editor.name.field_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="card-type" className="text-xs">
                  Type *
                </Label>
                <Select
                  value={form.cardType}
                  onValueChange={(v) => set("cardType", v)}
                >
                  <SelectTrigger
                    id="card-type"
                    className={cn(
                      "h-8 text-sm",
                      errors.cardType && "border-destructive",
                    )}
                    data-ocid="card-editor.type_select"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(cardTypes.length > 0
                      ? cardTypes
                      : ["Creature", "Spell", "Resource"]
                    ).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cardType && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="card-editor.type.field_error"
                  >
                    {errors.cardType}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="card-cost" className="text-xs">
                  Cost (0–10) *
                </Label>
                <Input
                  id="card-cost"
                  type="number"
                  min="0"
                  max="10"
                  value={form.cost}
                  onChange={(e) => set("cost", e.target.value)}
                  className={cn(
                    "h-8 tabular-nums",
                    errors.cost && "border-destructive",
                  )}
                  data-ocid="card-editor.cost_input"
                />
                {errors.cost && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="card-editor.cost.field_error"
                  >
                    {errors.cost}
                  </p>
                )}
              </div>

              {/* Rarity */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Rarity</Label>
                <div className="flex items-center gap-1.5">
                  {RARITY_OPTIONS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() =>
                        set("rarity", form.rarity === r.value ? null : r.value)
                      }
                      className={cn(
                        "flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full border transition-colors duration-150",
                        form.rarity === r.value
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50",
                      )}
                      data-ocid={`card-editor.rarity.${r.value}.button`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: r.dot }}
                      />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="card-attack" className="text-xs">
                  Attack
                </Label>
                <Input
                  id="card-attack"
                  type="number"
                  min="0"
                  value={form.attack}
                  onChange={(e) => set("attack", e.target.value)}
                  placeholder="—"
                  className="h-8 tabular-nums"
                  data-ocid="card-editor.attack_input"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="card-defense" className="text-xs">
                  Defense
                </Label>
                <Input
                  id="card-defense"
                  type="number"
                  min="0"
                  value={form.defense}
                  onChange={(e) => set("defense", e.target.value)}
                  placeholder="—"
                  className="h-8 tabular-nums"
                  data-ocid="card-editor.defense_input"
                />
              </div>
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Tags
            </h3>
            <div className="flex gap-2 mb-2">
              <Input
                value={form.tagInput}
                onChange={(e) => set("tagInput", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag + Enter"
                className="h-7 text-xs flex-1"
                data-ocid="card-editor.tag_input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={addTag}
                data-ocid="card-editor.add_tag_button"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 text-xs pr-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "tags",
                        form.tags.filter((t) => t !== tag),
                      )
                    }
                    className="hover:text-destructive transition-colors"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
          </section>

          {/* Text */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Text
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="card-rules" className="text-xs">
                  Rules Text
                </Label>
                <Textarea
                  id="card-rules"
                  value={form.rulesText}
                  onChange={(e) => set("rulesText", e.target.value)}
                  placeholder="Freeform rules description…"
                  className="text-xs min-h-[60px] resize-none"
                  data-ocid="card-editor.rules_text_input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="card-flavour" className="text-xs">
                  Flavour Text
                </Label>
                <Textarea
                  id="card-flavour"
                  value={form.flavourText}
                  onChange={(e) => set("flavourText", e.target.value)}
                  placeholder="Italic flavour quote…"
                  className="text-xs min-h-[48px] resize-none"
                  data-ocid="card-editor.flavour_text_input"
                />
              </div>
            </div>
          </section>

          {/* Art */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Art
            </h3>
            <Input
              value={form.artUrl}
              onChange={(e) => set("artUrl", e.target.value)}
              placeholder="Image URL or leave blank"
              className="h-8 text-xs"
              data-ocid="card-editor.art_url_input"
            />
          </section>

          {/* Abilities */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Abilities
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={addAbility}
                data-ocid="card-editor.add_ability_button"
              >
                <Plus size={12} /> Add Ability
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {form.abilities.map((ab, i) => (
                <AbilityRow
                  key={String(ab.id)}
                  ability={ab}
                  index={i}
                  keywords={gameDefinition?.keywords ?? []}
                  onChange={(updated) => {
                    const a = [...form.abilities];
                    a[i] = updated;
                    set("abilities", a);
                  }}
                  onRemove={() =>
                    set(
                      "abilities",
                      form.abilities.filter((_, idx) => idx !== i),
                    )
                  }
                />
              ))}
              {form.abilities.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No abilities yet.
                </p>
              )}
            </div>
          </section>

          {mutationError && (
            <p
              className="text-xs text-destructive"
              data-ocid="card-editor.error_state"
            >
              {mutationError}
            </p>
          )}
        </div>

        {/* Preview column */}
        <div className="hidden xl:flex w-56 border-l border-border p-4 flex-col gap-3 items-center bg-muted/20">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
            Preview
          </p>
          <CardPreview card={previewData} size="full" />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 flex items-center justify-between gap-2 bg-card">
        {!isNew && (
          <div className="flex items-center gap-2">
            {showDeleteConfirm ? (
              <>
                <span className="text-xs text-destructive">
                  Delete this card?
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleDelete}
                  disabled={deleteCard.isPending}
                  data-ocid="card-editor.confirm_button"
                >
                  {deleteCard.isPending ? "Deleting…" : "Yes, delete"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowDeleteConfirm(false)}
                  data-ocid="card-editor.cancel_button"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
                data-ocid="card-editor.delete_button"
              >
                <Trash2 size={13} className="mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={onClose}
              data-ocid="card-editor.secondary_button"
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            className="h-8 text-xs"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="card-editor.save_button"
          >
            {isSaving ? "Saving…" : isNew ? "Create Card" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
