"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { evolution, evolutionAnnee } from "@/lib/data"
import { useSession } from "@/lib/session-store"

const axisStyle = {
  fontSize: 12,
  fill: "oklch(0.54 0.015 85)",
}

function TooltipBox({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  unit?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: p.color }}
            aria-hidden
          />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-medium text-foreground">
            {p.value}
            {unit}
          </span>
        </p>
      ))}
    </div>
  )
}

// Charge quotidienne empilée (focus / réunions / perso) vs capacité
export function WeekLoadChart() {
  const { jours } = useSession()
  return (
    <div className="h-64 w-full" role="img" aria-label="Répartition de la charge par jour de la semaine">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={jours} barCategoryGap={14} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="oklch(0.91 0.012 90)" />
          <XAxis dataKey="jour" tickLine={false} axisLine={false} tick={axisStyle} />
          <YAxis tickLine={false} axisLine={false} tick={axisStyle} unit="h" width={44} />
          <Tooltip cursor={{ fill: "oklch(0.955 0.01 95)" }} content={<TooltipBox unit=" h" />} />
          <ReferenceLine
            y={7}
            stroke="oklch(0.66 0.15 32)"
            strokeDasharray="5 5"
            label={{
              value: "Limite confortable",
              position: "insideTopRight",
              fontSize: 11,
              fill: "oklch(0.55 0.15 32)",
            }}
          />
          <Bar dataKey="focus" name="concentration" stackId="a" fill="#b7aedc" radius={[0, 0, 0, 0]} />
          <Bar dataKey="reunions" name="réunions" stackId="a" fill="#DCE5E8" />
          <Bar dataKey="perso" name="personnel" stackId="a" fill="#fff6d6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Évolution de la charge de travail : 8 dernières semaines ou 12 derniers mois.
export function LoadEvolutionChart({ periode = "mois" }: { periode?: "mois" | "annee" }) {
  const annuel = periode === "annee"
  // Normalise les deux jeux de données vers une forme commune { label, charge }.
  const data = annuel
    ? evolutionAnnee.map((d) => ({ label: d.periode, charge: d.charge }))
    : evolution.map((d) => ({ label: d.semaine, charge: d.charge }))
  const xKey = "label"
  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label={
        annuel
          ? "Évolution de la charge de travail sur douze mois"
          : "Évolution de la charge de travail sur huit semaines"
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="chargeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a7c8a0" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#a7c8a0" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="oklch(0.91 0.012 90)" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={axisStyle} />
          <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={44} domain={[0, 100]} />
          <Tooltip cursor={{ stroke: "oklch(0.91 0.012 90)" }} content={<TooltipBox unit=" %" />} />
          <ReferenceLine
            y={80}
            stroke="oklch(0.66 0.15 32)"
            strokeDasharray="5 5"
            label={{
              value: "Seuil de surcharge",
              position: "insideTopRight",
              fontSize: 11,
              fill: "oklch(0.55 0.15 32)",
            }}
          />
          <Area
            type="monotone"
            dataKey="charge"
            name="charge de travail"
            stroke="#8fb587"
            strokeWidth={2.5}
            fill="url(#chargeFill)"
            dot={{ r: 3, fill: "#8fb587" }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Mini barres horizontales pour la charge par projet
export function ProjectLoadBar({ value, statut }: { value: number; statut: string }) {
  const color =
    statut === "surcharge"
      ? "#f6d6c9"
      : statut === "tendu"
        ? "#f6d6c9"
        : "#a7c8a0"
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  )
}

export { Cell }
