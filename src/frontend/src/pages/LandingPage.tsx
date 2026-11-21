import { Link } from "@tanstack/react-router";
import { Globe, Layers, Lock } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Design Everything",
    outcome: "Build cards, rules, and mechanics with a full design toolkit.",
    ocid: "features.design_card",
  },
  {
    icon: Globe,
    title: "Play Online",
    outcome:
      "Invite friends or anyone with a link to play your game in real time.",
    ocid: "features.play_card",
  },
  {
    icon: Lock,
    title: "Own It Completely",
    outcome: "Your instance, your data, your game — no platform in the middle.",
    ocid: "features.own_card",
  },
];

export default function LandingPage() {
  const scrollToFeatures = () => {
    const el = document.getElementById("features-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      data-ocid="landing.page"
      style={{
        height: "100dvh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >
      {/* Section 1 — Hero */}
      <section
        data-ocid="landing.hero_section"
        style={{
          scrollSnapAlign: "start",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(to right, oklch(0.22 0.10 220) 0%, oklch(0.28 0.12 220) 40%, oklch(0.35 0.10 210) 60%, oklch(0.28 0.08 195) 100%)",
        }}
      >
        {/* Floating card silhouettes — decorative, right half */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {/* Scattered card rectangles */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "55%",
              width: 72,
              height: 100,
              borderRadius: 10,
              background: "rgba(255,255,255,0.07)",
              transform: "rotate(-15deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "63%",
              width: 80,
              height: 112,
              borderRadius: 10,
              background: "rgba(255,255,255,0.10)",
              transform: "rotate(-5deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "74%",
              width: 72,
              height: 100,
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              transform: "rotate(8deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "68%",
              width: 64,
              height: 90,
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              transform: "rotate(18deg)",
            }}
          />
          {/* Fanned amber card group */}
          <div
            style={{
              position: "absolute",
              top: "54%",
              left: "57%",
              width: 90,
              height: 126,
              borderRadius: 10,
              background: "oklch(0.65 0.18 75 / 0.20)",
              transform: "rotate(-12deg)",
              transformOrigin: "bottom center",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "52%",
              left: "61%",
              width: 90,
              height: 126,
              borderRadius: 10,
              background: "oklch(0.65 0.18 75 / 0.22)",
              transform: "rotate(-2deg)",
              transformOrigin: "bottom center",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "52%",
              left: "65%",
              width: 90,
              height: 126,
              borderRadius: 10,
              background: "oklch(0.65 0.18 75 / 0.18)",
              transform: "rotate(10deg)",
              transformOrigin: "bottom center",
            }}
          />
          {/* Subtle grid dots */}
          <svg
            aria-hidden="true"
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, opacity: 0.04 }}
          >
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        {/* Copy — sits above both panels */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            height: "100%",
            padding: "0 clamp(1.5rem, 8vw, 8rem)",
          }}
        >
          <div style={{ maxWidth: "42%" }}>
            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              Design Your Game.
              <br />
              Play It Online.
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "clamp(1rem, 1.6vw, 1.125rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.75)",
                marginTop: "1.25rem",
                marginBottom: "2.25rem",
                maxWidth: "34rem",
              }}
            >
              Build your trading card game from scratch — cards, rules, decks —
              then publish it and play with real opponents online. You own the
              whole thing.
            </p>

            {/* CTA row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/design"
                data-ocid="landing.hero_cta"
                style={{
                  display: "inline-block",
                  background: "oklch(0.55 0.18 195)",
                  color: "#ffffff",
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  padding: "1rem 2rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  transition: "opacity 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
              >
                Start Designing
              </Link>
              <button
                type="button"
                data-ocid="landing.see_how_link"
                onClick={scrollToFeatures}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.9375rem",
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.95)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.65)";
                }}
              >
                See how it works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Features */}
      <section
        id="features-section"
        data-ocid="landing.features_section"
        style={{
          scrollSnapAlign: "start",
          height: "100dvh",
          background: "oklch(0.98 0.01 0)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 clamp(1.5rem, 8vw, 6rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
            maxWidth: "64rem",
            width: "100%",
          }}
        >
          {features.map(({ icon: Icon, title, outcome, ocid }) => (
            <div
              key={title}
              data-ocid={ocid}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "2.75rem",
                  height: "2.75rem",
                  borderRadius: "0.625rem",
                  background: "oklch(0.92 0.05 195)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={20}
                  style={{ color: "oklch(0.35 0.15 195)" }}
                  aria-hidden
                />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "oklch(0.1 0 0)",
                  margin: 0,
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.9375rem",
                  lineHeight: 1.6,
                  color: "oklch(0.4 0 0)",
                  margin: 0,
                }}
              >
                {outcome}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Closing CTA */}
      <section
        data-ocid="landing.cta_section"
        style={{
          scrollSnapAlign: "start",
          height: "100dvh",
          background: "oklch(0.25 0.12 195)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 clamp(1.5rem, 8vw, 6rem)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            fontWeight: 700,
            color: "oklch(0.98 0.01 0)",
            margin: 0,
            marginBottom: "2rem",
            lineHeight: 1.1,
          }}
        >
          Ready to build your game?
        </h2>
        <Link
          to="/design"
          data-ocid="landing.closing_cta"
          style={{
            display: "inline-block",
            background: "oklch(0.98 0.01 0)",
            color: "oklch(0.25 0.12 195)",
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            padding: "0.875rem 2rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            transition: "opacity 150ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          Start Building
        </Link>
      </section>
    </div>
  );
}
