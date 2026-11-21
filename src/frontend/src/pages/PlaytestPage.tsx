import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Copy, FlaskConical, UserPlus } from "lucide-react";
import { useState } from "react";

const INVITE_CODE = "TEST-8821";

// Show empty state if no sessions have been started
const HAS_SESSIONS = false;

export default function PlaytestPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(
      `${window.location.origin}/join/${INVITE_CODE}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!HAS_SESSIONS) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full min-h-[400px] p-8"
        data-ocid="playtest.empty_state"
      >
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FlaskConical className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground font-display">
            Run Your First Playtest
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Solo playtests let you feel the game before you invite others.
            Invite playtester links let others join.
          </p>
          <button
            type="button"
            data-ocid="playtest.start_solo.primary_button"
            style={{
              background: "var(--primary)",
              color: "white",
              borderRadius: "0.5rem",
              padding: "0.625rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {}}
          >
            Start Solo Playtest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl" data-ocid="playtest.page">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground font-display">
          Playtest
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Test your game before publishing. Run a solo session or invite someone
          to play with you.
        </p>
      </div>

      <div className="space-y-3">
        {/* Solo Playtest */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground">
                Solo Playtest
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Play both sides of the game yourself to test flow, rules, and
                card balance.
              </p>
              <div className="mt-3">
                <Link to="/play/new">
                  <Button
                    type="button"
                    size="sm"
                    data-ocid="playtest.solo_button"
                  >
                    Start Solo Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Playtester */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground">
                Invite a Playtester
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Share a join code so someone can test the game with you.
              </p>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInvite((v) => !v)}
                  data-ocid="playtest.invite_button"
                >
                  {showInvite ? "Hide Invite" : "Generate Invite"}
                </Button>
              </div>

              {showInvite && (
                <div
                  className="mt-3 rounded-lg border border-border bg-muted/40 p-3"
                  data-ocid="playtest.invite_section"
                >
                  <p className="text-xs text-muted-foreground mb-2">
                    Share this link:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 min-w-0 truncate rounded bg-background border border-border px-3 py-1.5 text-xs font-mono text-foreground">
                      {window.location.origin}/join/{INVITE_CODE}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      data-ocid="playtest.copy_link_button"
                      className="shrink-0"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Join code:{" "}
                    <span className="font-mono font-semibold text-foreground">
                      {INVITE_CODE}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
