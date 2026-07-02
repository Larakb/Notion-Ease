"use client"

export type LevelOption = { label: string; value: number }

// Niveaux de concentration proposés (mappés vers des heures représentatives).
export const concentrationOptions: LevelOption[] = [
  { label: "Faible", value: 2 },
  { label: "Modérée", value: 4 },
  { label: "Élevée", value: 6 },
]

// Ressenti d'énergie proposé (mappé vers un score 0 à 100).
export const energieOptions: LevelOption[] = [
  { label: "Épuisé", value: 20 },
  { label: "Fatigué", value: 40 },
  { label: "Correct", value: 60 },
  { label: "En forme", value: 80 },
  { label: "Au top", value: 100 },
]

// Renvoie l'option la plus proche d'une valeur numérique (pour l'affichage initial).
export function nearestOption(options: LevelOption[], value: number): LevelOption {
  return options.reduce(
    (best, o) => (Math.abs(o.value - value) < Math.abs(best.value - value) ? o : best),
    options[0],
  )
}

// Renvoie le libellé d'énergie correspondant à un score 0 à 100.
export function energieLabel(value: number): string {
  return nearestOption(energieOptions, value).label
}

// Barre d'énergie : un slider dont le curseur affiche le ressenti en toutes lettres.
export function EnergieSlider({
  value,
  onChange,
  ariaLabel,
}: {
  value: number
  onChange: (v: number) => void
  ariaLabel: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{energieOptions[0].label}</span>
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          {energieLabel(value)}
        </span>
        <span className="text-xs text-muted-foreground">
          {energieOptions[energieOptions.length - 1].label}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        aria-valuetext={energieLabel(value)}
        className="w-full cursor-pointer accent-primary"
      />
      <div className="flex justify-between px-0.5">
        {energieOptions.map((o) => (
          <span key={o.value} className="text-[10px] text-muted-foreground">
            {o.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LevelSelect({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: LevelOption[]
  value: number
  onChange: (v: number) => void
  ariaLabel: string
}) {
  const current = nearestOption(options, value)
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const actif = o.value === current.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={actif}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              actif
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
