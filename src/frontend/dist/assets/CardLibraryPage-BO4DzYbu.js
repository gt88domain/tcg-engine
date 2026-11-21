import { k as createLucideIcon, j as jsxRuntimeExports, l as cn, m as createContextScope, n as React, o as useComposedRefs, p as createSlot, r as reactExports, q as useCallbackRef$1, P as Primitive, s as useControllableState, t as Root2$1, v as useId, A as Anchor, w as composeEventHandlers, x as useLayoutEffect2, y as Portal$1, z as reactDomExports, C as createPopperScope, V as VISUALLY_HIDDEN_STYLES, D as DismissableLayer, E as Content, F as Arrow, H as ChevronDown, I as Check, J as Variant_freeform_structured, K as AbilityTrigger, M as AbilityTarget, u as useGame, d as Skeleton } from "./index-Ch41Ib91.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { I as Input } from "./input-CV14CozU.js";
import { L as Label } from "./label-TE4_J2Pw.js";
import { u as useCreateCard, a as useUpdateCard, b as useDeleteCard, c as useCardLibrary } from "./useCards-v-tHgnVD.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import { u as useDirection, c as clamp } from "./index-rFnOFFTx.js";
import { u as usePrevious, C as ChevronUp, T as Trash2 } from "./index-Bqs1IBQB.js";
import { P as Plus } from "./plus-BKBsPs_y.js";
import "./index-CyXusObr.js";
import "./index-Bqm77G7d.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("flag", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function cardTypeToToken(cardType) {
  const map = {
    threat: "threat",
    answer: "answer",
    draw: "draw",
    resource: "resource",
    disruption: "disruption",
    defense: "defense",
    utility: "utility",
    finisher: "finisher"
  };
  return map[cardType == null ? void 0 : cardType.toLowerCase()] ?? "resource";
}
const RARITY_LABELS = {
  common: "C",
  uncommon: "U",
  rare: "R",
  mythic: "M",
  legendary: "L"
};
function rarityFromCost(cost) {
  if (cost >= 7) return "mythic";
  if (cost >= 5) return "rare";
  if (cost >= 3) return "uncommon";
  return "common";
}
function rarityFromTags(tags) {
  if (!tags) return null;
  const r = tags.find((t) => t.startsWith("rarity:"));
  if (!r) return null;
  const val = r.replace("rarity:", "");
  if (["common", "uncommon", "rare", "legendary"].includes(val)) {
    return val === "legendary" ? "mythic" : val;
  }
  return null;
}
function CardPreview({
  card,
  size = "full",
  selected,
  onClick
}) {
  var _a;
  const typeToken = cardTypeToToken(card.cardType ?? "");
  const cost = card.cost ?? 0;
  const explicitRarity = rarityFromTags(card.tags);
  const rarity = explicitRarity ?? rarityFromCost(cost);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      onClick,
      onKeyDown: onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : void 0,
      tabIndex: onClick ? 0 : void 0,
      "data-ocid": "card-preview.card",
      className: cn(
        "relative flex flex-col overflow-hidden font-body select-none bg-card border rounded-lg",
        size === "thumb" && "w-full aspect-[3/4] cursor-pointer transition-transform duration-150 hover:scale-[1.02]",
        size === "full" && "w-full max-w-[260px] aspect-[3/4]",
        selected && "ring-2 ring-primary",
        onClick && "cursor-pointer"
      ),
      style: {
        borderColor: `oklch(var(--card-${typeToken}) / 0.6)`,
        boxShadow: `0 0 0 1px oklch(var(--card-${typeToken}) / 0.15)`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative flex-[1.8] overflow-hidden",
            style: { background: `oklch(var(--card-${typeToken}) / 0.12)` },
            children: [
              card.artUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: card.artUrl,
                  alt: card.name ?? "card art",
                  className: "w-full h-full object-cover",
                  loading: "lazy"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl opacity-30", children: "🃏" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white shadow",
                  style: { background: `oklch(var(--rarity-${rarity}))` },
                  title: rarity,
                  children: RARITY_LABELS[rarity]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute top-1.5 right-1.5 min-w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-mono font-bold text-white shadow tabular-nums",
                  style: { background: `oklch(var(--card-${typeToken}))` },
                  children: cost
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-2 py-1 flex items-center justify-between gap-1",
            style: { background: `oklch(var(--card-${typeToken}) / 0.18)` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "font-display font-semibold truncate min-w-0",
                    size === "thumb" ? "text-[11px]" : "text-sm"
                  ),
                  children: card.name || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "Card Name" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "shrink-0 text-[9px] font-mono uppercase tracking-wide px-1 rounded",
                  style: {
                    color: `oklch(var(--card-${typeToken}))`,
                    background: `oklch(var(--card-${typeToken}) / 0.15)`
                  },
                  children: card.cardType || "—"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-[2] px-2 py-1.5 overflow-hidden flex flex-col gap-1", children: [
          (((_a = card.abilities) == null ? void 0 : _a.length) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: (card.abilities ?? []).slice(0, 2).map((ab, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-[9px] leading-tight text-foreground/70",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                  ab.name,
                  ":"
                ] }),
                " ",
                ab.rulesText ?? "structured ability"
              ]
            },
            ab.name ? `${ab.name}-${i}` : i
          )) }),
          card.rulesText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] leading-tight text-foreground/80 italic line-clamp-3", children: card.rulesText }),
          card.flavourText && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] leading-tight text-muted-foreground italic line-clamp-2 mt-auto", children: [
            '"',
            card.flavourText,
            '"'
          ] })
        ] }),
        (card.attack !== void 0 || card.defense !== void 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-end gap-3 px-2 py-1 border-t",
            style: {
              borderColor: `oklch(var(--card-${typeToken}) / 0.3)`,
              background: `oklch(var(--card-${typeToken}) / 0.08)`
            },
            children: [
              card.attack !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono font-bold tabular-nums", children: [
                "⚔️ ",
                card.attack
              ] }),
              card.defense !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono font-bold tabular-nums", children: [
                "🛡 ",
                card.defense
              ] })
            ]
          }
        )
      ]
    }
  );
}
function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope2] = createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React.useRef(null);
    const itemMap = React.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection2(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection2,
    createCollectionScope2
  ];
}
var count = 0;
function useFocusGuards() {
  reactExports.useEffect(() => {
    const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
    count++;
    return () => {
      if (count === 1) {
        document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
      }
      count--;
    };
  }, []);
}
function createFocusGuard() {
  const element = document.createElement("span");
  element.setAttribute("data-radix-focus-guard", "");
  element.tabIndex = 0;
  element.style.outline = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  return element;
}
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = reactExports.forwardRef((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props;
  const [container, setContainer] = reactExports.useState(null);
  const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
  const lastFocusedElementRef = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
  const focusScope = reactExports.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  }).current;
  reactExports.useEffect(() => {
    if (trapped) {
      let handleFocusIn2 = function(event) {
        if (focusScope.paused || !container) return;
        const target = event.target;
        if (container.contains(target)) {
          lastFocusedElementRef.current = target;
        } else {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleFocusOut2 = function(event) {
        if (focusScope.paused || !container) return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) return;
        if (!container.contains(relatedTarget)) {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleMutations2 = function(mutations) {
        const focusedElement = document.activeElement;
        if (focusedElement !== document.body) return;
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0) focus(container);
        }
      };
      document.addEventListener("focusin", handleFocusIn2);
      document.addEventListener("focusout", handleFocusOut2);
      const mutationObserver = new MutationObserver(handleMutations2);
      if (container) mutationObserver.observe(container, { childList: true, subtree: true });
      return () => {
        document.removeEventListener("focusin", handleFocusIn2);
        document.removeEventListener("focusout", handleFocusOut2);
        mutationObserver.disconnect();
      };
    }
  }, [trapped, container, focusScope.paused]);
  reactExports.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement;
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
          if (document.activeElement === previouslyFocusedElement) {
            focus(container);
          }
        }
      }
      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
  const handleKeyDown = reactExports.useCallback(
    (event) => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container2 = event.currentTarget;
        const [first, last] = getTabbableEdges(container2);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container2) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) focus(first, { select: true });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) focus(last, { select: true });
          }
        }
      }
    },
    [loop, trapped, focusScope.paused]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst(candidates, { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}
function getTabbableEdges(container) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last];
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function findVisible(elements, container) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container })) return element;
  }
}
function isHidden(node, { upTo }) {
  if (getComputedStyle(node).visibility === "hidden") return true;
  while (node) {
    if (upTo !== void 0 && node === upTo) return false;
    if (getComputedStyle(node).display === "none") return true;
    node = node.parentElement;
  }
  return false;
}
function isSelectableInput(element) {
  return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    element.focus({ preventScroll: true });
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
      element.select();
  }
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
  let stack = [];
  return {
    add(focusScope) {
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope == null ? void 0 : activeFocusScope.pause();
      }
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },
    remove(focusScope) {
      var _a;
      stack = arrayRemove(stack, focusScope);
      (_a = stack[0]) == null ? void 0 : _a.resume();
    }
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}
var getDefaultParent = function(originalTarget) {
  if (typeof document === "undefined") {
    return null;
  }
  var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
  return sampleTarget.ownerDocument.body;
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
  return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
  return targets.map(function(target) {
    if (parent.contains(target)) {
      return target;
    }
    var correctedTarget = unwrapHost(target);
    if (correctedTarget && parent.contains(correctedTarget)) {
      return correctedTarget;
    }
    console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
    return null;
  }).filter(function(x) {
    return Boolean(x);
  });
};
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
  var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
  if (!markerMap[markerName]) {
    markerMap[markerName] = /* @__PURE__ */ new WeakMap();
  }
  var markerCounter = markerMap[markerName];
  var hiddenNodes = [];
  var elementsToKeep = /* @__PURE__ */ new Set();
  var elementsToStop = new Set(targets);
  var keep = function(el) {
    if (!el || elementsToKeep.has(el)) {
      return;
    }
    elementsToKeep.add(el);
    keep(el.parentNode);
  };
  targets.forEach(keep);
  var deep = function(parent) {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }
    Array.prototype.forEach.call(parent.children, function(node) {
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        try {
          var attr = node.getAttribute(controlAttribute);
          var alreadyHidden = attr !== null && attr !== "false";
          var counterValue = (counterMap.get(node) || 0) + 1;
          var markerValue = (markerCounter.get(node) || 0) + 1;
          counterMap.set(node, counterValue);
          markerCounter.set(node, markerValue);
          hiddenNodes.push(node);
          if (counterValue === 1 && alreadyHidden) {
            uncontrolledNodes.set(node, true);
          }
          if (markerValue === 1) {
            node.setAttribute(markerName, "true");
          }
          if (!alreadyHidden) {
            node.setAttribute(controlAttribute, "true");
          }
        } catch (e) {
          console.error("aria-hidden: cannot operate on ", node, e);
        }
      }
    });
  };
  deep(parentNode);
  elementsToKeep.clear();
  lockCount++;
  return function() {
    hiddenNodes.forEach(function(node) {
      var counterValue = counterMap.get(node) - 1;
      var markerValue = markerCounter.get(node) - 1;
      counterMap.set(node, counterValue);
      markerCounter.set(node, markerValue);
      if (!counterValue) {
        if (!uncontrolledNodes.has(node)) {
          node.removeAttribute(controlAttribute);
        }
        uncontrolledNodes.delete(node);
      }
      if (!markerValue) {
        node.removeAttribute(markerName);
      }
    });
    lockCount--;
    if (!lockCount) {
      counterMap = /* @__PURE__ */ new WeakMap();
      counterMap = /* @__PURE__ */ new WeakMap();
      uncontrolledNodes = /* @__PURE__ */ new WeakMap();
      markerMap = {};
    }
  };
};
var hideOthers = function(originalTarget, parentNode, markerName) {
  if (markerName === void 0) {
    markerName = "data-aria-hidden";
  }
  var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
  var activeParentNode = getDefaultParent(originalTarget);
  if (!activeParentNode) {
    return function() {
      return null;
    };
  }
  targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
  return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
var removedBarSizeVariable = "--removed-body-scroll-bar-size";
function assignRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
  return ref;
}
function useCallbackRef(initialValue, callback) {
  var ref = reactExports.useState(function() {
    return {
      // value
      value: initialValue,
      // last callback
      callback,
      // "memoized" public interface
      facade: {
        get current() {
          return ref.value;
        },
        set current(value) {
          var last = ref.value;
          if (last !== value) {
            ref.value = value;
            ref.callback(value, last);
          }
        }
      }
    };
  })[0];
  ref.callback = callback;
  return ref.facade;
}
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
function useMergeRefs(refs, defaultValue) {
  var callbackRef = useCallbackRef(null, function(newValue) {
    return refs.forEach(function(ref) {
      return assignRef(ref, newValue);
    });
  });
  useIsomorphicLayoutEffect(function() {
    var oldValue = currentValues.get(callbackRef);
    if (oldValue) {
      var prevRefs_1 = new Set(oldValue);
      var nextRefs_1 = new Set(refs);
      var current_1 = callbackRef.current;
      prevRefs_1.forEach(function(ref) {
        if (!nextRefs_1.has(ref)) {
          assignRef(ref, null);
        }
      });
      nextRefs_1.forEach(function(ref) {
        if (!prevRefs_1.has(ref)) {
          assignRef(ref, current_1);
        }
      });
    }
    currentValues.set(callbackRef, refs);
  }, [refs]);
  return callbackRef;
}
function ItoI(a) {
  return a;
}
function innerCreateMedium(defaults, middleware) {
  if (middleware === void 0) {
    middleware = ItoI;
  }
  var buffer = [];
  var assigned = false;
  var medium = {
    read: function() {
      if (assigned) {
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      }
      if (buffer.length) {
        return buffer[buffer.length - 1];
      }
      return defaults;
    },
    useMedium: function(data) {
      var item = middleware(data, assigned);
      buffer.push(item);
      return function() {
        buffer = buffer.filter(function(x) {
          return x !== item;
        });
      };
    },
    assignSyncMedium: function(cb) {
      assigned = true;
      while (buffer.length) {
        var cbs = buffer;
        buffer = [];
        cbs.forEach(cb);
      }
      buffer = {
        push: function(x) {
          return cb(x);
        },
        filter: function() {
          return buffer;
        }
      };
    },
    assignMedium: function(cb) {
      assigned = true;
      var pendingQueue = [];
      if (buffer.length) {
        var cbs = buffer;
        buffer = [];
        cbs.forEach(cb);
        pendingQueue = buffer;
      }
      var executeQueue = function() {
        var cbs2 = pendingQueue;
        pendingQueue = [];
        cbs2.forEach(cb);
      };
      var cycle = function() {
        return Promise.resolve().then(executeQueue);
      };
      cycle();
      buffer = {
        push: function(x) {
          pendingQueue.push(x);
          cycle();
        },
        filter: function(filter) {
          pendingQueue = pendingQueue.filter(filter);
          return buffer;
        }
      };
    }
  };
  return medium;
}
function createSidecarMedium(options) {
  if (options === void 0) {
    options = {};
  }
  var medium = innerCreateMedium(null);
  medium.options = __assign({ async: true, ssr: false }, options);
  return medium;
}
var SideCar$1 = function(_a) {
  var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
  if (!sideCar) {
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  }
  var Target = sideCar.read();
  if (!Target) {
    throw new Error("Sidecar medium not found");
  }
  return reactExports.createElement(Target, __assign({}, rest));
};
SideCar$1.isSideCarExport = true;
function exportSidecar(medium, exported) {
  medium.useMedium(exported);
  return SideCar$1;
}
var effectCar = createSidecarMedium();
var nothing = function() {
  return;
};
var RemoveScroll = reactExports.forwardRef(function(props, parentRef) {
  var ref = reactExports.useRef(null);
  var _a = reactExports.useState({
    onScrollCapture: nothing,
    onWheelCapture: nothing,
    onTouchMoveCapture: nothing
  }), callbacks = _a[0], setCallbacks = _a[1];
  var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
  var SideCar2 = sideCar;
  var containerRef = useMergeRefs([ref, parentRef]);
  var containerProps = __assign(__assign({}, rest), callbacks);
  return reactExports.createElement(
    reactExports.Fragment,
    null,
    enabled && reactExports.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noRelative, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
    forwardProps ? reactExports.cloneElement(reactExports.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : reactExports.createElement(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
  );
});
RemoveScroll.defaultProps = {
  enabled: true,
  removeScrollBar: true,
  inert: false
};
RemoveScroll.classNames = {
  fullWidth: fullWidthClassName,
  zeroRight: zeroRightClassName
};
var getNonce = function() {
  if (typeof __webpack_nonce__ !== "undefined") {
    return __webpack_nonce__;
  }
  return void 0;
};
function makeStyleTag() {
  if (!document)
    return null;
  var tag = document.createElement("style");
  tag.type = "text/css";
  var nonce = getNonce();
  if (nonce) {
    tag.setAttribute("nonce", nonce);
  }
  return tag;
}
function injectStyles(tag, css) {
  if (tag.styleSheet) {
    tag.styleSheet.cssText = css;
  } else {
    tag.appendChild(document.createTextNode(css));
  }
}
function insertStyleTag(tag) {
  var head = document.head || document.getElementsByTagName("head")[0];
  head.appendChild(tag);
}
var stylesheetSingleton = function() {
  var counter = 0;
  var stylesheet = null;
  return {
    add: function(style) {
      if (counter == 0) {
        if (stylesheet = makeStyleTag()) {
          injectStyles(stylesheet, style);
          insertStyleTag(stylesheet);
        }
      }
      counter++;
    },
    remove: function() {
      counter--;
      if (!counter && stylesheet) {
        stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
        stylesheet = null;
      }
    }
  };
};
var styleHookSingleton = function() {
  var sheet = stylesheetSingleton();
  return function(styles, isDynamic) {
    reactExports.useEffect(function() {
      sheet.add(styles);
      return function() {
        sheet.remove();
      };
    }, [styles && isDynamic]);
  };
};
var styleSingleton = function() {
  var useStyle = styleHookSingleton();
  var Sheet = function(_a) {
    var styles = _a.styles, dynamic = _a.dynamic;
    useStyle(styles, dynamic);
    return null;
  };
  return Sheet;
};
var zeroGap = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
};
var parse = function(x) {
  return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
  var cs = window.getComputedStyle(document.body);
  var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
  var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
  var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
  return [parse(left), parse(top), parse(right)];
};
var getGapWidth = function(gapMode) {
  if (gapMode === void 0) {
    gapMode = "margin";
  }
  if (typeof window === "undefined") {
    return zeroGap;
  }
  var offsets = getOffset(gapMode);
  var documentWidth = document.documentElement.clientWidth;
  var windowWidth = window.innerWidth;
  return {
    left: offsets[0],
    top: offsets[1],
    right: offsets[2],
    gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
  };
};
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a, allowRelative, gapMode, important) {
  var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
  if (gapMode === void 0) {
    gapMode = "margin";
  }
  return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
    allowRelative && "position: relative ".concat(important, ";"),
    gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
    gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
  ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
  var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
  return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
  reactExports.useEffect(function() {
    document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
    return function() {
      var newCounter = getCurrentUseCounter() - 1;
      if (newCounter <= 0) {
        document.body.removeAttribute(lockAttribute);
      } else {
        document.body.setAttribute(lockAttribute, newCounter.toString());
      }
    };
  }, []);
};
var RemoveScrollBar = function(_a) {
  var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
  useLockAttribute();
  var gap = reactExports.useMemo(function() {
    return getGapWidth(gapMode);
  }, [gapMode]);
  return reactExports.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    var options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
        return true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var nonPassive = passiveSupported ? { passive: false } : false;
var alwaysContainsScroll = function(node) {
  return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
  if (!(node instanceof Element)) {
    return false;
  }
  var styles = window.getComputedStyle(node);
  return (
    // not-not-scrollable
    styles[overflow] !== "hidden" && // contains scroll inside self
    !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
  );
};
var elementCouldBeVScrolled = function(node) {
  return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
  return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
  var ownerDocument = node.ownerDocument;
  var current = node;
  do {
    if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
      current = current.host;
    }
    var isScrollable = elementCouldBeScrolled(axis, current);
    if (isScrollable) {
      var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
      if (scrollHeight > clientHeight) {
        return true;
      }
    }
    current = current.parentNode;
  } while (current && current !== ownerDocument.body);
  return false;
};
var getVScrollVariables = function(_a) {
  var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
  return [
    scrollTop,
    scrollHeight,
    clientHeight
  ];
};
var getHScrollVariables = function(_a) {
  var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
  return [
    scrollLeft,
    scrollWidth,
    clientWidth
  ];
};
var elementCouldBeScrolled = function(axis, node) {
  return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
  return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
  return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
  var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
  var delta = directionFactor * sourceDelta;
  var target = event.target;
  var targetInLock = endTarget.contains(target);
  var shouldCancelScroll = false;
  var isDeltaPositive = delta > 0;
  var availableScroll = 0;
  var availableScrollTop = 0;
  do {
    if (!target) {
      break;
    }
    var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
    var elementScroll = scroll_1 - capacity - directionFactor * position;
    if (position || elementScroll) {
      if (elementCouldBeScrolled(axis, target)) {
        availableScroll += elementScroll;
        availableScrollTop += position;
      }
    }
    var parent_1 = target.parentNode;
    target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
  } while (
    // portaled content
    !targetInLock && target !== document.body || // self content
    targetInLock && (endTarget.contains(target) || endTarget === target)
  );
  if (isDeltaPositive && (Math.abs(availableScroll) < 1 || false)) {
    shouldCancelScroll = true;
  } else if (!isDeltaPositive && (Math.abs(availableScrollTop) < 1 || false)) {
    shouldCancelScroll = true;
  }
  return shouldCancelScroll;
};
var getTouchXY = function(event) {
  return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
  return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
  return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
  return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
  return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
  var shouldPreventQueue = reactExports.useRef([]);
  var touchStartRef = reactExports.useRef([0, 0]);
  var activeAxis = reactExports.useRef();
  var id = reactExports.useState(idCounter++)[0];
  var Style2 = reactExports.useState(styleSingleton)[0];
  var lastProps = reactExports.useRef(props);
  reactExports.useEffect(function() {
    lastProps.current = props;
  }, [props]);
  reactExports.useEffect(function() {
    if (props.inert) {
      document.body.classList.add("block-interactivity-".concat(id));
      var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
      allow_1.forEach(function(el) {
        return el.classList.add("allow-interactivity-".concat(id));
      });
      return function() {
        document.body.classList.remove("block-interactivity-".concat(id));
        allow_1.forEach(function(el) {
          return el.classList.remove("allow-interactivity-".concat(id));
        });
      };
    }
    return;
  }, [props.inert, props.lockRef.current, props.shards]);
  var shouldCancelEvent = reactExports.useCallback(function(event, parent) {
    if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
      return !lastProps.current.allowPinchZoom;
    }
    var touch = getTouchXY(event);
    var touchStart = touchStartRef.current;
    var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
    var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
    var currentAxis;
    var target = event.target;
    var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
    if ("touches" in event && moveDirection === "h" && target.type === "range") {
      return false;
    }
    var selection = window.getSelection();
    var anchorNode = selection && selection.anchorNode;
    var isTouchingSelection = anchorNode ? anchorNode === target || anchorNode.contains(target) : false;
    if (isTouchingSelection) {
      return false;
    }
    var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
    if (!canBeScrolledInMainDirection) {
      return true;
    }
    if (canBeScrolledInMainDirection) {
      currentAxis = moveDirection;
    } else {
      currentAxis = moveDirection === "v" ? "h" : "v";
      canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
    }
    if (!canBeScrolledInMainDirection) {
      return false;
    }
    if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
      activeAxis.current = currentAxis;
    }
    if (!currentAxis) {
      return true;
    }
    var cancelingAxis = activeAxis.current || currentAxis;
    return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY);
  }, []);
  var shouldPrevent = reactExports.useCallback(function(_event) {
    var event = _event;
    if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
      return;
    }
    var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
    var sourceEvent = shouldPreventQueue.current.filter(function(e) {
      return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
    })[0];
    if (sourceEvent && sourceEvent.should) {
      if (event.cancelable) {
        event.preventDefault();
      }
      return;
    }
    if (!sourceEvent) {
      var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
        return node.contains(event.target);
      });
      var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
      if (shouldStop) {
        if (event.cancelable) {
          event.preventDefault();
        }
      }
    }
  }, []);
  var shouldCancel = reactExports.useCallback(function(name, delta, target, should) {
    var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
    shouldPreventQueue.current.push(event);
    setTimeout(function() {
      shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
        return e !== event;
      });
    }, 1);
  }, []);
  var scrollTouchStart = reactExports.useCallback(function(event) {
    touchStartRef.current = getTouchXY(event);
    activeAxis.current = void 0;
  }, []);
  var scrollWheel = reactExports.useCallback(function(event) {
    shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
  }, []);
  var scrollTouchMove = reactExports.useCallback(function(event) {
    shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
  }, []);
  reactExports.useEffect(function() {
    lockStack.push(Style2);
    props.setCallbacks({
      onScrollCapture: scrollWheel,
      onWheelCapture: scrollWheel,
      onTouchMoveCapture: scrollTouchMove
    });
    document.addEventListener("wheel", shouldPrevent, nonPassive);
    document.addEventListener("touchmove", shouldPrevent, nonPassive);
    document.addEventListener("touchstart", scrollTouchStart, nonPassive);
    return function() {
      lockStack = lockStack.filter(function(inst) {
        return inst !== Style2;
      });
      document.removeEventListener("wheel", shouldPrevent, nonPassive);
      document.removeEventListener("touchmove", shouldPrevent, nonPassive);
      document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
    };
  }, []);
  var removeScrollBar = props.removeScrollBar, inert = props.inert;
  return reactExports.createElement(
    reactExports.Fragment,
    null,
    inert ? reactExports.createElement(Style2, { styles: generateStyle(id) }) : null,
    removeScrollBar ? reactExports.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null
  );
}
function getOutermostShadowParent(node) {
  var shadowParent = null;
  while (node !== null) {
    if (node instanceof ShadowRoot) {
      shadowParent = node.host;
      node = node.host;
    }
    node = node.parentNode;
  }
  return shadowParent;
}
const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);
var ReactRemoveScroll = reactExports.forwardRef(function(props, ref) {
  return reactExports.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: SideCar }));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;
var OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection, useCollection, createCollectionScope] = createCollection(SELECT_NAME);
var [createSelectContext] = createContextScope(SELECT_NAME, [
  createCollectionScope,
  createPopperScope
]);
var usePopperScope = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select$1 = (props) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
    form
  } = props;
  const popperScope = usePopperScope(__scopeSelect);
  const [trigger, setTrigger] = reactExports.useState(null);
  const [valueNode, setValueNode] = reactExports.useState(null);
  const [valueNodeHasChildren, setValueNodeHasChildren] = reactExports.useState(false);
  const direction = useDirection(dir);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SELECT_NAME
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: SELECT_NAME
  });
  const triggerPointerDownPosRef = reactExports.useRef(null);
  const isFormControl = trigger ? form || !!trigger.closest("form") : true;
  const [nativeOptionsSet, setNativeOptionsSet] = reactExports.useState(/* @__PURE__ */ new Set());
  const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectProvider,
    {
      required,
      scope: __scopeSelect,
      trigger,
      onTriggerChange: setTrigger,
      valueNode,
      onValueNodeChange: setValueNode,
      valueNodeHasChildren,
      onValueNodeHasChildrenChange: setValueNodeHasChildren,
      contentId: useId(),
      value,
      onValueChange: setValue,
      open,
      onOpenChange: setOpen,
      dir: direction,
      triggerPointerDownPosRef,
      disabled,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectNativeOptionsProvider,
          {
            scope: props.__scopeSelect,
            onNativeOptionAdd: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option));
            }, []),
            onNativeOptionRemove: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev);
                optionsSet.delete(option);
                return optionsSet;
              });
            }, []),
            children
          }
        ) }),
        isFormControl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectBubbleInput,
          {
            "aria-hidden": true,
            required,
            tabIndex: -1,
            name,
            autoComplete,
            value,
            onChange: (event) => setValue(event.target.value),
            disabled,
            form,
            children: [
              value === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "" }) : null,
              Array.from(nativeOptionsSet)
            ]
          },
          nativeSelectKey
        ) : null
      ]
    }
  ) });
};
Select$1.displayName = SELECT_NAME;
var TRIGGER_NAME = "SelectTrigger";
var SelectTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(TRIGGER_NAME, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
    const getItems = useCollection(__scopeSelect);
    const pointerTypeRef = reactExports.useRef("touch");
    const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.value === context.value);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem !== void 0) {
        context.onValueChange(nextItem.value);
      }
    });
    const handleOpen = (pointerEvent) => {
      if (!isDisabled) {
        context.onOpenChange(true);
        resetTypeahead();
      }
      if (pointerEvent) {
        context.triggerPointerDownPosRef.current = {
          x: Math.round(pointerEvent.pageX),
          y: Math.round(pointerEvent.pageY)
        };
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": context.contentId,
        "aria-expanded": context.open,
        "aria-required": context.required,
        "aria-autocomplete": "none",
        dir: context.dir,
        "data-state": context.open ? "open" : "closed",
        disabled: isDisabled,
        "data-disabled": isDisabled ? "" : void 0,
        "data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
        ...triggerProps,
        ref: composedRefs,
        onClick: composeEventHandlers(triggerProps.onClick, (event) => {
          event.currentTarget.focus();
          if (pointerTypeRef.current !== "mouse") {
            handleOpen(event);
          }
        }),
        onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
          pointerTypeRef.current = event.pointerType;
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
          }
          if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
            handleOpen(event);
            event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
          const isTypingAhead = searchRef.current !== "";
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
          if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
          if (isTypingAhead && event.key === " ") return;
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
SelectTrigger$1.displayName = TRIGGER_NAME;
var VALUE_NAME = "SelectValue";
var SelectValue$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
    const context = useSelectContext(VALUE_NAME, __scopeSelect);
    const { onValueNodeHasChildrenChange } = context;
    const hasChildren = children !== void 0;
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
    useLayoutEffect2(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...valueProps,
        ref: composedRefs,
        style: { pointerEvents: "none" },
        children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: placeholder }) : children
      }
    );
  }
);
SelectValue$1.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...iconProps, ref: forwardedRef, children: children || "▼" });
  }
);
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME = "SelectPortal";
var SelectPortal = (props) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, ...props });
};
SelectPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "SelectContent";
var SelectContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME, props.__scopeSelect);
    const [fragment, setFragment] = reactExports.useState();
    useLayoutEffect2(() => {
      setFragment(new DocumentFragment());
    }, []);
    if (!context.open) {
      const frag = fragment;
      return frag ? reactDomExports.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentProvider, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: props.children }) }) }),
        frag
      ) : null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentImpl, { ...props, ref: forwardedRef });
  }
);
SelectContent$1.displayName = CONTENT_NAME;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot = createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      position = "item-aligned",
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = useSelectContext(CONTENT_NAME, __scopeSelect);
    const [content, setContent] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [selectedItem, setSelectedItem] = reactExports.useState(null);
    const [selectedItemText, setSelectedItemText] = reactExports.useState(
      null
    );
    const getItems = useCollection(__scopeSelect);
    const [isPositioned, setIsPositioned] = reactExports.useState(false);
    const firstValidItemFoundRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]);
    useFocusGuards();
    const focusFirst2 = reactExports.useCallback(
      (candidates) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
        const [lastItem] = restItems.slice(-1);
        const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
        for (const candidate of candidates) {
          if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
          candidate == null ? void 0 : candidate.scrollIntoView({ block: "nearest" });
          if (candidate === firstItem && viewport) viewport.scrollTop = 0;
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
          candidate == null ? void 0 : candidate.focus();
          if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
        }
      },
      [getItems, viewport]
    );
    const focusSelectedItem = reactExports.useCallback(
      () => focusFirst2([selectedItem, content]),
      [focusFirst2, selectedItem, content]
    );
    reactExports.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem();
      }
    }, [isPositioned, focusSelectedItem]);
    const { onOpenChange, triggerPointerDownPosRef } = context;
    reactExports.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 };
        const handlePointerMove = (event) => {
          var _a, _b;
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (((_a = triggerPointerDownPosRef.current) == null ? void 0 : _a.x) ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (((_b = triggerPointerDownPosRef.current) == null ? void 0 : _b.y) ?? 0))
          };
        };
        const handlePointerUp = (event) => {
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault();
          } else {
            if (!content.contains(event.target)) {
              onOpenChange(false);
            }
          }
          document.removeEventListener("pointermove", handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };
        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener("pointermove", handlePointerMove);
          document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
        }
        return () => {
          document.removeEventListener("pointermove", handlePointerMove);
          document.removeEventListener("pointerup", handlePointerUp, { capture: true });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);
    reactExports.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener("blur", close);
      window.addEventListener("resize", close);
      return () => {
        window.removeEventListener("blur", close);
        window.removeEventListener("resize", close);
      };
    }, [onOpenChange]);
    const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem) {
        setTimeout(() => nextItem.ref.current.focus());
      }
    });
    const itemRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node);
          if (isFirstValidItem) firstValidItemFoundRef.current = true;
        }
      },
      [context.value]
    );
    const handleItemLeave = reactExports.useCallback(() => content == null ? void 0 : content.focus(), [content]);
    const itemTextRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node);
        }
      },
      [context.value]
    );
    const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
    const popperContentProps = SelectPosition === SelectPopperPosition ? {
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions
    } : {};
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectContentProvider,
      {
        scope: __scopeSelect,
        content,
        viewport,
        onViewportChange: setViewport,
        itemRefCallback,
        selectedItem,
        onItemLeave: handleItemLeave,
        itemTextRefCallback,
        focusSelectedItem,
        selectedItemText,
        position,
        isPositioned,
        searchRef,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: context.open,
            onMountAutoFocus: (event) => {
              event.preventDefault();
            },
            onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
              var _a;
              (_a = context.trigger) == null ? void 0 : _a.focus({ preventScroll: true });
              event.preventDefault();
            }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside: (event) => event.preventDefault(),
                onDismiss: () => context.onOpenChange(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectPosition,
                  {
                    role: "listbox",
                    id: context.contentId,
                    "data-state": context.open ? "open" : "closed",
                    dir: context.dir,
                    onContextMenu: (event) => event.preventDefault(),
                    ...contentProps,
                    ...popperContentProps,
                    onPlaced: () => setIsPositioned(true),
                    ref: composedRefs,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...contentProps.style
                    },
                    onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                      if (event.key === "Tab") event.preventDefault();
                      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
                      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                        const items = getItems().filter((item) => !item.disabled);
                        let candidateNodes = items.map((item) => item.ref.current);
                        if (["ArrowUp", "End"].includes(event.key)) {
                          candidateNodes = candidateNodes.slice().reverse();
                        }
                        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                          const currentElement = event.target;
                          const currentIndex = candidateNodes.indexOf(currentElement);
                          candidateNodes = candidateNodes.slice(currentIndex + 1);
                        }
                        setTimeout(() => focusFirst2(candidateNodes));
                        event.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onPlaced, ...popperProps } = props;
  const context = useSelectContext(CONTENT_NAME, __scopeSelect);
  const contentContext = useSelectContentContext(CONTENT_NAME, __scopeSelect);
  const [contentWrapper, setContentWrapper] = reactExports.useState(null);
  const [content, setContent] = reactExports.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
  const getItems = useCollection(__scopeSelect);
  const shouldExpandOnScrollRef = reactExports.useRef(false);
  const shouldRepositionRef = reactExports.useRef(true);
  const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
  const position = reactExports.useCallback(() => {
    if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
      const triggerRect = context.trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const valueNodeRect = context.valueNode.getBoundingClientRect();
      const itemTextRect = selectedItemText.getBoundingClientRect();
      if (context.dir !== "rtl") {
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNodeRect.left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedLeft = clamp(left, [
          CONTENT_MARGIN,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(CONTENT_MARGIN, rightEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.left = clampedLeft + "px";
      } else {
        const itemTextOffset = contentRect.right - itemTextRect.right;
        const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
        const rightDelta = window.innerWidth - triggerRect.right - right;
        const minContentWidth = triggerRect.width + rightDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const leftEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedRight = clamp(right, [
          CONTENT_MARGIN,
          Math.max(CONTENT_MARGIN, leftEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.right = clampedRight + "px";
      }
      const items = getItems();
      const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
      const itemsHeight = viewport.scrollHeight;
      const contentStyles = window.getComputedStyle(content);
      const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
      const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
      const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
      const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
      const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
      const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
      const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
      const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
      const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
      const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
      const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
      const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
      const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
      const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
      if (willAlignWithoutTopOverflow) {
        const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
        contentWrapper.style.bottom = "0px";
        const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
        const clampedTriggerMiddleToBottomEdge = Math.max(
          triggerMiddleToBottomEdge,
          selectedItemHalfHeight + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth
        );
        const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        contentWrapper.style.height = height + "px";
      } else {
        const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
        contentWrapper.style.top = "0px";
        const clampedTopEdgeToTriggerMiddle = Math.max(
          topEdgeToTriggerMiddle,
          contentBorderTopWidth + viewport.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight
        );
        const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
        contentWrapper.style.height = height + "px";
        viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
      }
      contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
      contentWrapper.style.minHeight = minContentHeight + "px";
      contentWrapper.style.maxHeight = availableHeight + "px";
      onPlaced == null ? void 0 : onPlaced();
      requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
    }
  }, [
    getItems,
    context.trigger,
    context.valueNode,
    contentWrapper,
    content,
    viewport,
    selectedItem,
    selectedItemText,
    context.dir,
    onPlaced
  ]);
  useLayoutEffect2(() => position(), [position]);
  const [contentZIndex, setContentZIndex] = reactExports.useState();
  useLayoutEffect2(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
  }, [content]);
  const handleScrollButtonChange = reactExports.useCallback(
    (node) => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem == null ? void 0 : focusSelectedItem();
        shouldRepositionRef.current = false;
      }
    },
    [position, focusSelectedItem]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectViewportProvider,
    {
      scope: __scopeSelect,
      contentWrapper,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: setContentWrapper,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: contentZIndex
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              ...popperProps,
              ref: composedRefs,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...popperProps.style
              }
            }
          )
        }
      )
    }
  );
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeSelect,
    align = "start",
    collisionPadding = CONTENT_MARGIN,
    ...popperProps
  } = props;
  const popperScope = usePopperScope(__scopeSelect);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      ...popperScope,
      ...popperProps,
      ref: forwardedRef,
      align,
      collisionPadding,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...popperProps.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-select-content-available-width": "var(--radix-popper-available-width)",
          "--radix-select-content-available-height": "var(--radix-popper-available-height)",
          "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, nonce, ...viewportProps } = props;
    const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = reactExports.useRef(0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...viewportProps,
          ref: composedRefs,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...viewportProps.style
          },
          onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
            const viewport = event.currentTarget;
            const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
            if ((shouldExpandOnScrollRef == null ? void 0 : shouldExpandOnScrollRef.current) && contentWrapper) {
              const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
              if (scrolledBy > 0) {
                const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                const cssHeight = parseFloat(contentWrapper.style.height);
                const prevHeight = Math.max(cssMinHeight, cssHeight);
                if (prevHeight < availableHeight) {
                  const nextHeight = prevHeight + scrolledBy;
                  const clampedNextHeight = Math.min(availableHeight, nextHeight);
                  const heightDiff = nextHeight - clampedNextHeight;
                  contentWrapper.style.height = clampedNextHeight + "px";
                  if (contentWrapper.style.bottom === "0px") {
                    viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                    contentWrapper.style.justifyContent = "flex-end";
                  }
                }
              }
            }
            prevScrollTopRef.current = viewport.scrollTop;
          })
        }
      ) })
    ] });
  }
);
SelectViewport.displayName = VIEWPORT_NAME;
var GROUP_NAME = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME);
var SelectGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props;
    const groupId = useId();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectGroupContextProvider, { scope: __scopeSelect, id: groupId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", "aria-labelledby": groupId, ...groupProps, ref: forwardedRef }) });
  }
);
SelectGroup.displayName = GROUP_NAME;
var LABEL_NAME = "SelectLabel";
var SelectLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props;
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { id: groupContext.id, ...labelProps, ref: forwardedRef });
  }
);
SelectLabel.displayName = LABEL_NAME;
var ITEM_NAME = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME);
var SelectItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = useSelectContext(ITEM_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = reactExports.useState(textValueProp ?? "");
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => {
        var _a;
        return (_a = contentContext.itemRefCallback) == null ? void 0 : _a.call(contentContext, node, value, disabled);
      }
    );
    const textId = useId();
    const pointerTypeRef = reactExports.useRef("touch");
    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };
    if (value === "") {
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectItemContextProvider,
      {
        scope: __scopeSelect,
        value,
        disabled,
        textId,
        isSelected,
        onItemTextChange: reactExports.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || ((node == null ? void 0 : node.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Collection.ItemSlot,
          {
            scope: __scopeSelect,
            value,
            disabled,
            textValue,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "option",
                "aria-labelledby": textId,
                "data-highlighted": isFocused ? "" : void 0,
                "aria-selected": isSelected && isFocused,
                "data-state": isSelected ? "checked" : "unchecked",
                "aria-disabled": disabled || void 0,
                "data-disabled": disabled ? "" : void 0,
                tabIndex: disabled ? void 0 : -1,
                ...itemProps,
                ref: composedRefs,
                onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
                onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
                onClick: composeEventHandlers(itemProps.onClick, () => {
                  if (pointerTypeRef.current !== "mouse") handleSelect();
                }),
                onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
                  if (pointerTypeRef.current === "mouse") handleSelect();
                }),
                onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
                  pointerTypeRef.current = event.pointerType;
                }),
                onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
                  var _a;
                  pointerTypeRef.current = event.pointerType;
                  if (disabled) {
                    (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
                  } else if (pointerTypeRef.current === "mouse") {
                    event.currentTarget.focus({ preventScroll: true });
                  }
                }),
                onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
                  var _a;
                  if (event.currentTarget === document.activeElement) {
                    (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
                  }
                }),
                onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
                  var _a;
                  const isTypingAhead = ((_a = contentContext.searchRef) == null ? void 0 : _a.current) !== "";
                  if (isTypingAhead && event.key === " ") return;
                  if (SELECTION_KEYS.includes(event.key)) handleSelect();
                  if (event.key === " ") event.preventDefault();
                })
              }
            )
          }
        )
      }
    );
  }
);
SelectItem$1.displayName = ITEM_NAME;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, ...itemTextProps } = props;
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = reactExports.useState(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node) => {
        var _a;
        return (_a = contentContext.itemTextRefCallback) == null ? void 0 : _a.call(contentContext, node, itemContext.value, itemContext.disabled);
      }
    );
    const textContent = itemTextNode == null ? void 0 : itemTextNode.textContent;
    const nativeOption = reactExports.useMemo(
      () => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: itemContext.value, disabled: itemContext.disabled, children: textContent }, itemContext.value),
      [itemContext.disabled, itemContext.value, textContent]
    );
    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
    useLayoutEffect2(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { id: itemContext.textId, ...itemTextProps, ref: composedRefs }),
      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? reactDomExports.createPortal(itemTextProps.children, context.valueNode) : null
    ] });
  }
);
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props;
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect);
    return itemContext.isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...itemIndicatorProps, ref: forwardedRef }) : null;
  }
);
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton$1 = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const [canScrollUp, setCanScrollUp] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const canScrollUp2 = viewport.scrollTop > 0;
        setCanScrollUp(canScrollUp2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollUpButton$1.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton$1 = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const [canScrollDown, setCanScrollDown] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
        setCanScrollDown(canScrollDown2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollDown ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollDownButton$1.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
  const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
  const autoScrollTimerRef = reactExports.useRef(null);
  const getItems = useCollection(__scopeSelect);
  const clearAutoScrollTimer = reactExports.useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);
  reactExports.useEffect(() => {
    return () => clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);
  useLayoutEffect2(() => {
    var _a;
    const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
    (_a = activeItem == null ? void 0 : activeItem.ref.current) == null ? void 0 : _a.scrollIntoView({ block: "nearest" });
  }, [getItems]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "aria-hidden": true,
      ...scrollIndicatorProps,
      ref: forwardedRef,
      style: { flexShrink: 0, ...scrollIndicatorProps.style },
      onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        var _a;
        (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer();
      })
    }
  );
});
var SEPARATOR_NAME = "SelectSeparator";
var SelectSeparator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { "aria-hidden": true, ...separatorProps, ref: forwardedRef });
  }
);
SelectSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "SelectArrow";
var SelectArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(ARROW_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
    return context.open && contentContext.position === "popper" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef }) : null;
  }
);
SelectArrow.displayName = ARROW_NAME;
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = reactExports.forwardRef(
  ({ __scopeSelect, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const select = ref.current;
      if (!select) return;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        selectProto,
        "value"
      );
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("change", { bubbles: true });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.select,
      {
        ...props,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style },
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME;
function shouldShowPlaceholder(value) {
  return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
  const handleSearchChange = useCallbackRef$1(onSearchChange);
  const searchRef = reactExports.useRef("");
  const timerRef = reactExports.useRef(0);
  const handleTypeaheadSearch = reactExports.useCallback(
    (key) => {
      const search = searchRef.current + key;
      handleSearchChange(search);
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
    },
    [handleSearchChange]
  );
  const resetTypeahead = reactExports.useCallback(() => {
    searchRef.current = "";
    window.clearTimeout(timerRef.current);
  }, []);
  reactExports.useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);
  return [searchRef, handleTypeaheadSearch, resetTypeahead];
}
function findNextItem(items, search, currentItem) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
  let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
  const excludeCurrentItem = normalizedSearch.length === 1;
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
  const nextItem = wrappedItems.find(
    (item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root2 = Select$1;
var Trigger = SelectTrigger$1;
var Value = SelectValue$1;
var Icon = SelectIcon;
var Portal = SelectPortal;
var Content2 = SelectContent$1;
var Viewport = SelectViewport;
var Item = SelectItem$1;
var ItemText = SelectItemText;
var ItemIndicator = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton$1;
var ScrollDownButton = SelectScrollDownButton$1;
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
    }
  );
}
const RARITY_OPTIONS = [
  { value: "Common", label: "Common", dot: "oklch(var(--rarity-common))" },
  {
    value: "Uncommon",
    label: "Uncommon",
    dot: "oklch(var(--rarity-uncommon))"
  },
  { value: "Rare", label: "Rare", dot: "oklch(var(--rarity-rare))" },
  {
    value: "Legendary",
    label: "Legendary",
    dot: "oklch(var(--rarity-mythic))"
  }
];
function setRarityInTags(tags, rarity) {
  const base = tags.filter((t) => !t.startsWith("rarity:"));
  if (rarity) return [...base, `rarity:${rarity}`];
  return base;
}
const DEFAULT_FORM = {
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
  rarity: null
};
function cardToForm(card) {
  const rarityTag = card.tags.find((t) => t.startsWith("rarity:"));
  const rarity = rarityTag ? rarityTag.replace("rarity:", "") : null;
  return {
    name: card.name,
    cost: String(card.cost),
    attack: card.attack !== void 0 ? String(card.attack) : "",
    defense: card.defense !== void 0 ? String(card.defense) : "",
    cardType: card.cardType,
    tags: card.tags.filter((t) => !t.startsWith("rarity:")),
    tagInput: "",
    rulesText: card.rulesText ?? "",
    flavourText: card.flavourText ?? "",
    artUrl: card.artUrl ?? "",
    abilities: card.abilities.map((a) => ({
      ...a,
      effects: [...a.effects],
      targets: [...a.targets]
    })),
    rarity
  };
}
const TRIGGER_OPTIONS = [
  { value: AbilityTrigger.EnterPlay, label: "When this enters play" },
  { value: AbilityTrigger.Attacks, label: "When this attacks" },
  { value: AbilityTrigger.DealsDamage, label: "When this deals damage" },
  { value: AbilityTrigger.StartOfTurn, label: "At start of your turn" },
  { value: AbilityTrigger.EndOfTurn, label: "At end of your turn" },
  { value: AbilityTrigger.Destroyed, label: "When this is destroyed" },
  { value: AbilityTrigger.Activated, label: "Activated: pay cost" },
  { value: AbilityTrigger.Passive, label: "Passive (always active)" }
];
const TARGET_OPTIONS = [
  { value: AbilityTarget.TargetCreature, label: "Target creature" },
  { value: AbilityTarget.TargetPlayer, label: "Target player" },
  { value: AbilityTarget.AllCreatures, label: "All creatures" },
  {
    value: AbilityTarget.AllOpponentCreatures,
    label: "All opponent's creatures"
  },
  { value: AbilityTarget.AllYourCreatures, label: "All your creatures" },
  { value: AbilityTarget.Opponent, label: "Opponent" },
  { value: AbilityTarget.You, label: "You" },
  { value: AbilityTarget.ThisCard, label: "This card" },
  { value: AbilityTarget.NoTarget, label: "No target" }
];
const EFFECT_OPTIONS = [
  { value: "DealDamage", label: "Deal X damage" },
  { value: "HealLife", label: "Heal X life" },
  { value: "DrawCards", label: "Draw X cards" },
  { value: "GainResources", label: "Gain X resources this turn" },
  { value: "StatBoostUntilEOT", label: "+X/+Y stat boost until end of turn" },
  {
    value: "StatReduceUntilEOT",
    label: "-X/-Y stat reduction until end of turn"
  },
  { value: "Destroy", label: "Destroy target" },
  { value: "ReturnToHand", label: "Return to hand" },
  { value: "Counter", label: "Counter (negate)" },
  { value: "GiveKeyword", label: "Give keyword" },
  { value: "CustomEffect", label: "Custom effect (manual)" }
];
function makeDefaultEffect(kind) {
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
function effectLabel(effect, keywords) {
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
      return `Give keyword: ${((kw == null ? void 0 : kw.name) ?? effect.GiveKeyword) || "?"}`;
    }
    case "CustomEffect":
      return effect.CustomEffect || "Custom effect";
  }
}
function abilityIsManual(ability) {
  return ability.effects.some((e) => e.__kind__ === "CustomEffect") || !!ability.conditionText;
}
function abilitySentence(ability, keywords) {
  const triggerOpt = TRIGGER_OPTIONS.find((t) => t.value === ability.trigger);
  const targetOpt = TARGET_OPTIONS.find(
    (t) => ability.targets.includes(t.value)
  );
  const effects = ability.effects.map((e) => effectLabel(e, keywords)).join(", ");
  const parts = [];
  if (triggerOpt) parts.push(triggerOpt.label);
  if (effects) parts.push(effects);
  if (targetOpt) parts.push(`on ${targetOpt.label}`);
  return parts.join(" → ") || ability.name || "New ability";
}
function EffectEditor({
  effect,
  keywords,
  onChange,
  onRemove
}) {
  const kind = effect.__kind__;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: kind,
        onChange: (e) => onChange(makeDefaultEffect(e.target.value)),
        className: "h-7 text-xs rounded border border-input bg-background px-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
        "aria-label": "Effect type",
        children: EFFECT_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
      }
    ),
    (kind === "DealDamage" || kind === "HealLife" || kind === "DrawCards" || kind === "GainResources") && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        type: "number",
        min: "0",
        className: "h-7 w-16 text-xs tabular-nums",
        value: String(
          kind === "DealDamage" ? effect.DealDamage : kind === "HealLife" ? effect.HealLife : kind === "DrawCards" ? effect.DrawCards : effect.GainResources
        ),
        onChange: (ev) => {
          const n = BigInt(Math.max(0, Number(ev.target.value) || 0));
          if (kind === "DealDamage")
            onChange({ __kind__: "DealDamage", DealDamage: n });
          else if (kind === "HealLife")
            onChange({ __kind__: "HealLife", HealLife: n });
          else if (kind === "DrawCards")
            onChange({ __kind__: "DrawCards", DrawCards: n });
          else onChange({ __kind__: "GainResources", GainResources: n });
        }
      }
    ),
    (kind === "StatBoostUntilEOT" || kind === "StatReduceUntilEOT") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          min: "0",
          placeholder: "X",
          className: "h-7 w-14 text-xs tabular-nums",
          value: String(
            kind === "StatBoostUntilEOT" ? effect.StatBoostUntilEOT[0] : effect.StatReduceUntilEOT[0]
          ),
          onChange: (ev) => {
            const n = BigInt(Math.max(0, Number(ev.target.value) || 0));
            const cur = kind === "StatBoostUntilEOT" ? effect.StatBoostUntilEOT : effect.StatReduceUntilEOT;
            if (kind === "StatBoostUntilEOT")
              onChange({
                __kind__: "StatBoostUntilEOT",
                StatBoostUntilEOT: [n, cur[1]]
              });
            else
              onChange({
                __kind__: "StatReduceUntilEOT",
                StatReduceUntilEOT: [n, cur[1]]
              });
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          min: "0",
          placeholder: "Y",
          className: "h-7 w-14 text-xs tabular-nums",
          value: String(
            kind === "StatBoostUntilEOT" ? effect.StatBoostUntilEOT[1] : effect.StatReduceUntilEOT[1]
          ),
          onChange: (ev) => {
            const n = BigInt(Math.max(0, Number(ev.target.value) || 0));
            const cur = kind === "StatBoostUntilEOT" ? effect.StatBoostUntilEOT : effect.StatReduceUntilEOT;
            if (kind === "StatBoostUntilEOT")
              onChange({
                __kind__: "StatBoostUntilEOT",
                StatBoostUntilEOT: [cur[0], n]
              });
            else
              onChange({
                __kind__: "StatReduceUntilEOT",
                StatReduceUntilEOT: [cur[0], n]
              });
          }
        }
      )
    ] }),
    kind === "GiveKeyword" && (keywords.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        value: effect.GiveKeyword,
        onChange: (e) => onChange({ __kind__: "GiveKeyword", GiveKeyword: e.target.value }),
        className: "h-7 text-xs rounded border border-input bg-background px-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
        "aria-label": "Keyword",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select keyword…" }),
          keywords.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: k.id, children: k.name }, k.id))
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        placeholder: "Keyword name",
        className: "h-7 w-32 text-xs",
        value: effect.GiveKeyword,
        onChange: (e) => onChange({ __kind__: "GiveKeyword", GiveKeyword: e.target.value })
      }
    )),
    kind === "CustomEffect" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        placeholder: "Describe the effect…",
        className: "h-7 flex-1 min-w-[120px] text-xs",
        value: effect.CustomEffect,
        onChange: (ev) => onChange({
          __kind__: "CustomEffect",
          CustomEffect: ev.target.value
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onRemove,
        className: "ml-auto text-muted-foreground hover:text-destructive",
        "aria-label": "Remove effect",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
      }
    )
  ] });
}
function AbilityRow({
  ability,
  index,
  keywords,
  onChange,
  onRemove
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isManual = abilityIsManual(ability);
  const sentence = abilitySentence(ability, keywords);
  const toggleTarget = (t) => {
    const targets = ability.targets.includes(t) ? ability.targets.filter((x) => x !== t) : [...ability.targets, t];
    onChange({ ...ability, targets });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border rounded-md overflow-hidden",
      "data-ocid": `ability.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "flex-1 text-left flex items-center gap-2 min-w-0",
              onClick: () => setExpanded((v) => !v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate min-w-0", children: sentence }),
                isManual && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 flex items-center gap-0.5 text-[10px] text-warning font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { size: 10 }),
                  " manual"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "text-muted-foreground hover:text-foreground shrink-0",
              "aria-label": expanded ? "Collapse" : "Expand",
              children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onRemove,
              className: "text-muted-foreground hover:text-destructive shrink-0",
              "aria-label": "Remove ability",
              "data-ocid": `ability.delete_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
            }
          )
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-3 border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Ability Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "h-7 text-xs",
                value: ability.name,
                placeholder: "e.g. Battle Cry",
                onChange: (e) => onChange({ ...ability, name: e.target.value }),
                "data-ocid": `ability.name_input.${index + 1}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Trigger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: ability.trigger ?? "",
                onChange: (e) => onChange({
                  ...ability,
                  trigger: e.target.value || void 0
                }),
                className: "h-7 text-xs rounded border border-input bg-background px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                "data-ocid": `ability.trigger_select.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select trigger…" }),
                  TRIGGER_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Target(s)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: TARGET_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleTarget(o.value),
                className: cn(
                  "text-[11px] font-mono px-2 py-0.5 rounded border",
                  ability.targets.includes(o.value) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
                ),
                "data-ocid": `ability.target.${o.value.toLowerCase()}.${index + 1}`,
                children: o.label
              },
              o.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Effects" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onChange({
                    ...ability,
                    effects: [
                      ...ability.effects,
                      makeDefaultEffect("DealDamage")
                    ]
                  }),
                  className: "flex items-center gap-1 text-[11px] font-mono text-primary hover:text-primary/80",
                  "data-ocid": `ability.add_effect_button.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 10 }),
                    " Add effect"
                  ]
                }
              )
            ] }),
            ability.effects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "No effects yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: ability.effects.map((eff, ei) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              EffectEditor,
              {
                effect: eff,
                keywords,
                onChange: (updated) => {
                  const effects = [...ability.effects];
                  effects[ei] = updated;
                  onChange({ ...ability, effects });
                },
                onRemove: () => onChange({
                  ...ability,
                  effects: ability.effects.filter((_, i) => i !== ei)
                })
              },
              `${ability.id}-${ei}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
              "Condition",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional — adds manual flag)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "h-7 text-xs",
                placeholder: "If [condition]…",
                value: ability.conditionText ?? "",
                onChange: (e) => onChange({
                  ...ability,
                  conditionText: e.target.value || void 0
                })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onChange({
                  ...ability,
                  abilityType: ability.abilityType === Variant_freeform_structured.structured ? Variant_freeform_structured.freeform : Variant_freeform_structured.structured
                }),
                className: cn(
                  "text-[11px] font-mono px-2 py-0.5 rounded border",
                  ability.abilityType === Variant_freeform_structured.structured ? "bg-primary/10 border-primary/40 text-primary" : "border-border text-muted-foreground"
                ),
                children: ability.abilityType === Variant_freeform_structured.structured ? "Structured" : "Freeform"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CardEditorPanel({
  card,
  gameDefinition,
  onClose,
  onSaved,
  onDeleted
}) {
  var _a, _b;
  const isNew = !card;
  const [form, setForm] = reactExports.useState(
    card ? cardToForm(card) : DEFAULT_FORM
  );
  const [errors, setErrors] = reactExports.useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const abilityCounterRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    setForm(card ? cardToForm(card) : DEFAULT_FORM);
    setErrors({});
    setShowDeleteConfirm(false);
  }, [card]);
  const cardTypes = (gameDefinition == null ? void 0 : gameDefinition.cardTypes) ?? [];
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: void 0 }));
  }
  function validate() {
    const errs = {};
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
    const attack = form.attack !== "" ? BigInt(Number(form.attack)) : void 0;
    const defense = form.defense !== "" ? BigInt(Number(form.defense)) : void 0;
    const tags = setRarityInTags(form.tags, form.rarity);
    try {
      let saved;
      if (isNew) {
        saved = await createCard.mutateAsync({
          name: form.name.trim(),
          cost,
          attack,
          defense,
          cardType: form.cardType,
          tags,
          rulesText: form.rulesText || void 0,
          flavourText: form.flavourText || void 0,
          artUrl: form.artUrl || void 0,
          abilities: form.abilities
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
          abilities: form.abilities
        });
      }
      onSaved == null ? void 0 : onSaved(saved);
    } catch (_) {
    }
  }
  async function handleDelete() {
    if (!card) return;
    await deleteCard.mutateAsync(card.id);
    onDeleted == null ? void 0 : onDeleted();
  }
  function addTag() {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    set("tagInput", "");
  }
  function addAbility() {
    abilityCounterRef.current += 1;
    const newAbility = {
      id: BigInt(abilityCounterRef.current),
      name: "",
      abilityType: Variant_freeform_structured.structured,
      trigger: void 0,
      targets: [],
      effects: [],
      rulesText: void 0,
      conditionText: void 0
    };
    set("abilities", [...form.abilities, newAbility]);
  }
  const isSaving = createCard.isPending || updateCard.isPending;
  const mutationError = ((_a = createCard.error) == null ? void 0 : _a.message) ?? ((_b = updateCard.error) == null ? void 0 : _b.message);
  const previewData = {
    name: form.name,
    cost: Number(form.cost) || 0,
    cardType: form.cardType,
    attack: form.attack !== "" ? Number(form.attack) : void 0,
    defense: form.defense !== "" ? Number(form.defense) : void 0,
    rulesText: form.rulesText,
    flavourText: form.flavourText,
    artUrl: form.artUrl,
    abilities: form.abilities
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full bg-card border-l border-border",
      "data-ocid": "card-editor.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm", children: isNew ? "New Card" : `Edit: ${card.name}` }),
          onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Close editor",
              "data-ocid": "card-editor.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2", children: "Identity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card-name", className: "text-xs", children: "Name *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "card-name",
                      value: form.name,
                      onChange: (e) => set("name", e.target.value),
                      placeholder: "e.g. Storm Drake",
                      className: cn("h-8", errors.name && "border-destructive"),
                      "data-ocid": "card-editor.name_input"
                    }
                  ),
                  errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "card-editor.name.field_error",
                      children: errors.name
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card-type", className: "text-xs", children: "Type *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: form.cardType,
                      onValueChange: (v) => set("cardType", v),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            id: "card-type",
                            className: cn(
                              "h-8 text-sm",
                              errors.cardType && "border-destructive"
                            ),
                            "data-ocid": "card-editor.type_select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (cardTypes.length > 0 ? cardTypes : ["Creature", "Spell", "Resource"]).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
                      ]
                    }
                  ),
                  errors.cardType && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "card-editor.type.field_error",
                      children: errors.cardType
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card-cost", className: "text-xs", children: "Cost (0–10) *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "card-cost",
                      type: "number",
                      min: "0",
                      max: "10",
                      value: form.cost,
                      onChange: (e) => set("cost", e.target.value),
                      className: cn(
                        "h-8 tabular-nums",
                        errors.cost && "border-destructive"
                      ),
                      "data-ocid": "card-editor.cost_input"
                    }
                  ),
                  errors.cost && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "card-editor.cost.field_error",
                      children: errors.cost
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Rarity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: RARITY_OPTIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => set("rarity", form.rarity === r.value ? null : r.value),
                      className: cn(
                        "flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full border transition-colors duration-150",
                        form.rarity === r.value ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                      ),
                      "data-ocid": `card-editor.rarity.${r.value}.button`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "w-2 h-2 rounded-full",
                            style: { background: r.dot }
                          }
                        ),
                        r.label
                      ]
                    },
                    r.value
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card-attack", className: "text-xs", children: "Attack" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "card-attack",
                      type: "number",
                      min: "0",
                      value: form.attack,
                      onChange: (e) => set("attack", e.target.value),
                      placeholder: "—",
                      className: "h-8 tabular-nums",
                      "data-ocid": "card-editor.attack_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card-defense", className: "text-xs", children: "Defense" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "card-defense",
                      type: "number",
                      min: "0",
                      value: form.defense,
                      onChange: (e) => set("defense", e.target.value),
                      placeholder: "—",
                      className: "h-8 tabular-nums",
                      "data-ocid": "card-editor.defense_input"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2", children: "Tags" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.tagInput,
                    onChange: (e) => set("tagInput", e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    },
                    placeholder: "Add tag + Enter",
                    className: "h-7 text-xs flex-1",
                    "data-ocid": "card-editor.tag_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "h-7 text-xs",
                    onClick: addTag,
                    "data-ocid": "card-editor.add_tag_button",
                    children: "Add"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: form.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "gap-1 text-xs pr-1",
                  children: [
                    tag,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => set(
                          "tags",
                          form.tags.filter((t) => t !== tag)
                        ),
                        className: "hover:text-destructive transition-colors",
                        "aria-label": `Remove tag ${tag}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
                      }
                    )
                  ]
                },
                tag
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2", children: "Text" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card-rules", className: "text-xs", children: "Rules Text" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "card-rules",
                      value: form.rulesText,
                      onChange: (e) => set("rulesText", e.target.value),
                      placeholder: "Freeform rules description…",
                      className: "text-xs min-h-[60px] resize-none",
                      "data-ocid": "card-editor.rules_text_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card-flavour", className: "text-xs", children: "Flavour Text" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "card-flavour",
                      value: form.flavourText,
                      onChange: (e) => set("flavourText", e.target.value),
                      placeholder: "Italic flavour quote…",
                      className: "text-xs min-h-[48px] resize-none",
                      "data-ocid": "card-editor.flavour_text_input"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2", children: "Art" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.artUrl,
                  onChange: (e) => set("artUrl", e.target.value),
                  placeholder: "Image URL or leave blank",
                  className: "h-8 text-xs",
                  "data-ocid": "card-editor.art_url_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Abilities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "h-7 text-xs gap-1",
                    onClick: addAbility,
                    "data-ocid": "card-editor.add_ability_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                      " Add Ability"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                form.abilities.map((ab, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AbilityRow,
                  {
                    ability: ab,
                    index: i,
                    keywords: (gameDefinition == null ? void 0 : gameDefinition.keywords) ?? [],
                    onChange: (updated) => {
                      const a = [...form.abilities];
                      a[i] = updated;
                      set("abilities", a);
                    },
                    onRemove: () => set(
                      "abilities",
                      form.abilities.filter((_, idx) => idx !== i)
                    )
                  },
                  String(ab.id)
                )),
                form.abilities.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No abilities yet." })
              ] })
            ] }),
            mutationError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "card-editor.error_state",
                children: mutationError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden xl:flex w-56 border-l border-border p-4 flex-col gap-3 items-center bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide", children: "Preview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardPreview, { card: previewData, size: "full" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-4 py-3 flex items-center justify-between gap-2 bg-card", children: [
          !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: showDeleteConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", children: "Delete this card?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "destructive",
                size: "sm",
                className: "h-7 text-xs",
                onClick: handleDelete,
                disabled: deleteCard.isPending,
                "data-ocid": "card-editor.confirm_button",
                children: deleteCard.isPending ? "Deleting…" : "Yes, delete"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "h-7 text-xs",
                onClick: () => setShowDeleteConfirm(false),
                "data-ocid": "card-editor.cancel_button",
                children: "Cancel"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "h-7 text-xs text-destructive hover:text-destructive",
              onClick: () => setShowDeleteConfirm(true),
              "data-ocid": "card-editor.delete_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13, className: "mr-1" }),
                " Delete"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
            onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "h-8 text-xs",
                onClick: onClose,
                "data-ocid": "card-editor.secondary_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                className: "h-8 text-xs",
                onClick: handleSave,
                disabled: isSaving,
                "data-ocid": "card-editor.save_button",
                children: isSaving ? "Saving…" : isNew ? "Create Card" : "Save Changes"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CardThumbnail({
  card,
  selected,
  onSelect,
  selectMode,
  checked,
  onToggleCheck
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSelect(card),
      "data-ocid": `card-library.card.${Number(card.id)}`,
      className: cn(
        "relative w-full aspect-[2/3] rounded-xl border-2 flex flex-col items-start justify-between p-2 text-left",
        "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
        selected ? "border-primary shadow-[0_0_0_2px_oklch(var(--primary)/0.3)]" : "border-border hover:border-primary/50 hover:shadow-md"
      ),
      style: { background: "oklch(var(--card))" },
      children: [
        selectMode && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "absolute top-1.5 left-1.5 z-20 cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked,
            onChange: (e) => {
              e.stopPropagation();
              onToggleCheck(e);
            },
            className: "w-4 h-4 accent-primary cursor-pointer",
            "data-ocid": `card-library.checkbox.${Number(card.id)}`
          }
        ) }),
        card.artUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: card.artUrl,
            alt: card.name,
            className: "absolute inset-0 w-full h-full object-cover rounded-xl opacity-25"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full flex items-start justify-between gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-mono font-bold tabular-nums text-foreground", children: Number(card.cost) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[9px] px-1.5 py-0 h-4 font-mono truncate max-w-[80px]", children: card.cardType })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display font-semibold text-foreground leading-tight line-clamp-2", children: card.name }),
          card.rulesText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground leading-snug line-clamp-2 mt-0.5", children: card.rulesText })
        ] }),
        (card.attack !== void 0 || card.defense !== void 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full flex justify-between", children: [
          card.attack !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] font-mono tabular-nums",
              style: { color: "oklch(var(--card-threat))" },
              children: Number(card.attack)
            }
          ),
          card.defense !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] font-mono tabular-nums",
              style: { color: "oklch(var(--card-defense))" },
              children: Number(card.defense)
            }
          )
        ] })
      ]
    }
  );
}
function CardListRow({
  card,
  selected,
  onSelect,
  selectMode,
  checked,
  onToggleCheck
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSelect(card),
      "data-ocid": `card-library.list-item.${Number(card.id)}`,
      className: cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150",
        "border-b border-border/50 hover:bg-muted/40",
        selected ? "bg-primary/5 border-l-2 border-l-primary" : ""
      ),
      children: [
        selectMode && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "cursor-pointer shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked,
            onChange: (e) => {
              e.stopPropagation();
              onToggleCheck(e);
            },
            className: "w-4 h-4 accent-primary cursor-pointer",
            "data-ocid": `card-library.checkbox.${Number(card.id)}`
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-xs font-mono tabular-nums text-muted-foreground text-right shrink-0", children: Number(card.cost) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-display font-medium text-foreground truncate block", children: card.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground font-mono", children: card.cardType })
        ] }),
        card.attack !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-mono tabular-nums",
            style: { color: "oklch(var(--card-threat))" },
            children: Number(card.attack)
          }
        ),
        card.defense !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-mono tabular-nums",
            style: { color: "oklch(var(--card-defense))" },
            children: Number(card.defense)
          }
        )
      ]
    }
  );
}
function CardLibraryPage() {
  const { game } = useGame();
  const { data: cards = [], isLoading } = useCardLibrary(game == null ? void 0 : game.id);
  useCreateCard();
  useUpdateCard();
  const deleteCard = useDeleteCard();
  const [search, setSearch] = reactExports.useState("");
  const [activeType, setActiveType] = reactExports.useState(null);
  const [minCost, setMinCost] = reactExports.useState(0);
  const [maxCost, setMaxCost] = reactExports.useState(10);
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [selectedCard, setSelectedCard] = reactExports.useState(null);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [sortBy, setSortBy] = reactExports.useState("name-asc");
  const [hasAbilityFilter, setHasAbilityFilter] = reactExports.useState(false);
  const [selectMode, setSelectMode] = reactExports.useState(false);
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = reactExports.useState(false);
  const [bulkDeleteSuccess, setBulkDeleteSuccess] = reactExports.useState(false);
  const cardTypes = (game == null ? void 0 : game.cardTypes) ?? [];
  const maxCardCost = Math.max(10, ...cards.map((c) => Number(c.cost)));
  const filtered = reactExports.useMemo(() => {
    let result = cards.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (activeType && c.cardType !== activeType) return false;
      const cost = Number(c.cost);
      if (cost < minCost || cost > maxCost) return false;
      if (hasAbilityFilter && c.abilities.length === 0) return false;
      return true;
    });
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "cost-asc":
          return Number(a.cost) - Number(b.cost);
        case "cost-desc":
          return Number(b.cost) - Number(a.cost);
        case "type":
          return a.cardType.localeCompare(b.cardType) || a.name.localeCompare(b.name);
        case "date":
          return Number(b.createdAt) - Number(a.createdAt);
        default:
          return 0;
      }
    });
    return result;
  }, [cards, search, activeType, minCost, maxCost, sortBy, hasAbilityFilter]);
  const showEditor = selectedCard !== null || isCreating;
  const editorCard = isCreating ? null : selectedCard;
  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));
  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const c of filtered) next.delete(c.id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const c of filtered) next.add(c.id);
        return next;
      });
    }
  }
  function toggleCardCheck(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) => deleteCard.mutateAsync(id)));
    setSelectedIds(/* @__PURE__ */ new Set());
    setShowBulkDeleteConfirm(false);
    setSelectMode(false);
    setBulkDeleteSuccess(true);
    setTimeout(() => setBulkDeleteSuccess(false), 3e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", "data-ocid": "card-library.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px] max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search cards…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-8 text-sm h-8",
              "data-ocid": "card-library.search.search_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm", children: "🔍" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveType(null),
              "data-ocid": "card-library.filter.all.toggle",
              className: cn(
                "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors duration-150",
                activeType === null ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              ),
              children: "All"
            }
          ),
          cardTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveType(t === activeType ? null : t),
              "data-ocid": `card-library.filter.${t.toLowerCase()}.toggle`,
              className: cn(
                "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors duration-150",
                activeType === t ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              ),
              children: t
            },
            t
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setHasAbilityFilter((v) => !v),
              "data-ocid": "card-library.filter.has-ability.toggle",
              className: cn(
                "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors duration-150",
                hasAbilityFilter ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              ),
              children: "Has Ability"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] font-mono text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: maxCardCost,
              value: minCost,
              onChange: (e) => setMinCost(Number(e.target.value)),
              className: "w-16 accent-primary",
              "aria-label": "Min cost"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            minCost,
            "–",
            maxCost
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: maxCardCost,
              value: maxCost,
              onChange: (e) => setMaxCost(Number(e.target.value)),
              className: "w-16 accent-primary",
              "aria-label": "Max cost"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value),
            className: "h-8 text-[11px] font-mono rounded-md border border-input bg-background px-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            "data-ocid": "card-library.sort.select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name-asc", children: "Name A–Z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name-desc", children: "Name Z–A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cost-asc", children: "Cost: Low–High" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cost-desc", children: "Cost: High–Low" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "type", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "date", children: "Date Created" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 border border-border rounded-md overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("grid"),
              "data-ocid": "card-library.view-grid.toggle",
              className: cn(
                "px-2.5 py-1 text-[11px] font-mono transition-colors duration-150",
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              ),
              "aria-label": "Grid view",
              children: "⋯⋯"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("list"),
              "data-ocid": "card-library.view-list.toggle",
              className: cn(
                "px-2.5 py-1 text-[11px] font-mono transition-colors duration-150",
                viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              ),
              "aria-label": "List view",
              children: "≡"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelectMode((v) => !v);
              setSelectedIds(/* @__PURE__ */ new Set());
              setShowBulkDeleteConfirm(false);
            },
            "data-ocid": "card-library.select-mode.toggle",
            className: cn(
              "h-8 text-[11px] font-mono px-3 rounded-md border transition-colors duration-150",
              selectMode ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
            ),
            children: selectMode ? "Done" : "Select"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: () => {
              setSelectedCard(null);
              setIsCreating(true);
            },
            "data-ocid": "card-library.new-card.button",
            className: "h-8 text-xs",
            children: "+ New Card"
          }
        )
      ] }),
      selectMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-6 py-2 border-b border-border/50 bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs font-mono text-muted-foreground cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: allFilteredSelected,
              onChange: toggleSelectAll,
              className: "w-4 h-4 accent-primary",
              "data-ocid": "card-library.select-all.checkbox"
            }
          ),
          "Select All"
        ] }),
        selectedIds.size > 0 && !showBulkDeleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowBulkDeleteConfirm(true),
            className: "flex items-center gap-1.5 text-xs font-mono text-destructive hover:text-destructive/80 transition-colors",
            "data-ocid": "card-library.bulk-delete.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }),
              "Delete ",
              selectedIds.size,
              " card",
              selectedIds.size > 1 ? "s" : ""
            ]
          }
        )
      ] }),
      showBulkDeleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 px-6 py-2.5 border-b border-destructive/30 bg-destructive/5",
          "data-ocid": "card-library.bulk-delete.confirm_bar",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-destructive font-medium", children: [
              "Delete ",
              selectedIds.size,
              " card",
              selectedIds.size > 1 ? "s" : "",
              "? This cannot be undone."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "destructive",
                  size: "sm",
                  className: "h-7 text-xs",
                  onClick: handleBulkDelete,
                  disabled: deleteCard.isPending,
                  "data-ocid": "card-library.bulk-delete.confirm_button",
                  children: deleteCard.isPending ? "Deleting…" : "Delete"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "h-7 text-xs",
                  onClick: () => setShowBulkDeleteConfirm(false),
                  "data-ocid": "card-library.bulk-delete.cancel_button",
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      ),
      bulkDeleteSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 px-6 py-2 border-b border-success/30 bg-success/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-success font-medium", children: "Cards deleted successfully." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-2 text-xs text-muted-foreground font-mono border-b border-border/50 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px] font-mono mr-2", children: [
          filtered.length,
          " card",
          filtered.length !== 1 ? "s" : ""
        ] }),
        "of ",
        cards.length,
        " total"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 p-6", children: Array.from({ length: 12 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: positional skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[2/3] rounded-xl" }, i)
      )) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center h-64 gap-4",
          "data-ocid": "card-library.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🃏" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: cards.length === 0 ? "Design Your First Card" : "No cards match your filters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: cards.length === 0 ? "Cards must follow the rules you defined. Start with your resource cards and creatures." : "Try adjusting your search or filters." })
            ] }),
            cards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: () => {
                  setSelectedCard(null);
                  setIsCreating(true);
                },
                "data-ocid": "card-library.empty-new-card.button",
                children: "+ New Card"
              }
            )
          ]
        }
      ) : viewMode === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 p-6", children: filtered.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CardThumbnail,
        {
          card,
          selected: (selectedCard == null ? void 0 : selectedCard.id) === card.id,
          onSelect: (c) => {
            setSelectedCard(c);
            setIsCreating(false);
          },
          selectMode,
          checked: selectedIds.has(card.id),
          onToggleCheck: () => toggleCardCheck(card.id)
        },
        Number(card.id)
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "divide-y divide-border/50",
          "data-ocid": "card-library.list",
          children: filtered.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CardListRow,
            {
              card,
              selected: (selectedCard == null ? void 0 : selectedCard.id) === card.id,
              onSelect: (c) => {
                setSelectedCard(c);
                setIsCreating(false);
              },
              selectMode,
              checked: selectedIds.has(card.id),
              onToggleCheck: () => toggleCardCheck(card.id)
            },
            Number(card.id)
          ))
        }
      ) })
    ] }),
    showEditor && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-80 xl:w-96 shrink-0 border-l border-border flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CardEditorPanel,
      {
        card: editorCard,
        gameDefinition: game ?? void 0,
        onClose: () => {
          setSelectedCard(null);
          setIsCreating(false);
        },
        onSaved: () => {
          setSelectedCard(null);
          setIsCreating(false);
        }
      }
    ) })
  ] });
}
export {
  CardLibraryPage as default
};
