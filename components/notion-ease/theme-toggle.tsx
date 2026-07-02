"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

// Bascule mode clair (#F8F8F6) / mode sombre (#191919).
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // On lit le thème réellement appliqué au montage.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !isDark
    root.classList.toggle("dark", next)
    root.classList.toggle("light", !next)
    setIsDark(next)
  }

  return (
    <button
      onClick={toggle}
      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-pressed={isDark}
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  )
}
