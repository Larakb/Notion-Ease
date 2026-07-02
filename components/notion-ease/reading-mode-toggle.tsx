"use client"

import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/session-store"

// Bascule entre la lecture normale et le mode « Ease + » (vue épurée, apaisante).
// Le libellé indique le mode vers lequel on bascule.
export function ReadingModeToggle() {
  const { easePlus, toggleEasePlus } = useSession()

  return (
    <button
      onClick={toggleEasePlus}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
        easePlus
          ? "border-primary/50 bg-primary/15 text-foreground hover:bg-primary/25"
          : "border-border text-muted-foreground hover:bg-secondary",
      )}
      aria-pressed={easePlus}
      title={easePlus ? "Revenir à la lecture normale" : "Activer la lecture apaisée Ease +"}
    >
      <span className="whitespace-nowrap">
        {easePlus ? "Mode de lecture normale" : "Mode de lecture Ease +"}
      </span>
    </button>
  )
}
