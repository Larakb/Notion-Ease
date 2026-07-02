"use client"

// Store de session (en mémoire, réinitialisé à la fermeture de l'onglet).
// Aucune persistance ni base de données : les saisies vivent le temps de la session.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  projets as projetsDefaut,
  semaine as semaineDefaut,
  wellbeing as wellbeingDefaut,
  type Profile,
  type Statut,
} from "./data"
import { energieLabel, energieOptions } from "@/components/notion-ease/level-select"

export type { Statut } from "./data"

export type JourCharge = {
  jour: string
  focus: number
  reunions: number
  perso: number
  capacite: number
  rythme: number // heures de travail saisies pour le jour
  pause: number // heures de pause prises dans le jour
  energie: number // 0 à 100, ressenti d'énergie du jour
}

export type Projet = {
  id: string
  nom: string
  charge: number
  taches: number
  echeance: string
  statut: Statut
}

export type Indicateur = {
  id: string
  label: string
  valeur: string
  detail: string
  statut: Statut
  aide: string
}

// Jours par défaut, enrichis d'un ressenti d'énergie, d'un rythme et de pauses initiales.
const energieDefaut = [72, 66, 48, 40, 45, 78, 84]
const pauseDefaut = [1, 0.75, 0.5, 0.5, 0.5, 1.5, 2]
const joursDefaut: JourCharge[] = semaineDefaut.map((j, i) => ({
  ...j,
  // Le rythme initial correspond au total des heures travaillées ce jour-là.
  rythme: j.focus + j.reunions + j.perso,
  pause: pauseDefaut[i] ?? 0.5,
  energie: energieDefaut[i] ?? 60,
}))

const projetsInitiaux: Projet[] = projetsDefaut.map((p, i) => ({
  id: `p-${i}`,
  ...p,
}))

function round1(n: number) {
  return Math.round(n * 10) / 10
}

// Convertit un total d'heures en statut de charge.
function statutHeures(h: number): Statut {
  if (h <= 7) return "sain"
  if (h <= 8) return "tendu"
  return "surcharge"
}

// Convertit un niveau d'énergie (plus haut = mieux) en statut.
function statutEnergie(e: number): Statut {
  if (e >= 70) return "sain"
  if (e >= 50) return "tendu"
  return "surcharge"
}

// Convertit une moyenne de pause quotidienne (h, plus haut = mieux) en statut.
function statutPause(hParJour: number): Statut {
  if (hParJour >= 1) return "sain"
  if (hParJour >= 0.5) return "tendu"
  return "surcharge"
}

type SessionValue = {
  profile: Profile
  jours: JourCharge[]
  projets: Projet[]
  wellbeing: { score: number; ressenti: string; etat: string; message: string; tendance: number }
  indicateurs: Indicateur[]
  easePlus: boolean
  toggleEasePlus: () => void
  savedArticles: string[]
  toggleSavedArticle: (titre: string) => void
  updateProfile: (patch: Partial<Profile>) => void
  updateJour: (jour: string, patch: Partial<JourCharge>) => void
  addProjet: (p: Omit<Projet, "id">) => void
  updateProjet: (id: string, patch: Partial<Projet>) => void
  removeProjet: (id: string) => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({
  initialProfile,
  children,
}: {
  initialProfile?: Profile | null
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState<Profile>({
    name: initialProfile?.name?.trim() || "Lina",
    profil: initialProfile?.profil?.trim() || "Alternante",
    objectif: initialProfile?.objectif,
    fatigue: initialProfile?.fatigue,
    trouble: initialProfile?.trouble,
  })
  const [jours, setJours] = useState<JourCharge[]>(joursDefaut)
  const [projets, setProjets] = useState<Projet[]>(projetsInitiaux)

  // Mode de lecture « Ease + » : vue épurée et apaisante, réglé au niveau racine
  // pour teinter le fond de toute l'application.
  const [easePlus, setEasePlus] = useState(false)
  const toggleEasePlus = useCallback(() => setEasePlus((v) => !v), [])
  useEffect(() => {
    document.documentElement.classList.toggle("ease-plus", easePlus)
  }, [easePlus])

  // Articles enregistrés par l'utilisateur, retrouvables dans « Mes données ».
  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const toggleSavedArticle = useCallback((titre: string) => {
    setSavedArticles((prev) =>
      prev.includes(titre) ? prev.filter((t) => t !== titre) : [...prev, titre],
    )
  }, [])

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateJour = useCallback((jour: string, patch: Partial<JourCharge>) => {
    setJours((prev) => prev.map((j) => (j.jour === jour ? { ...j, ...patch } : j)))
  }, [])

  const addProjet = useCallback((p: Omit<Projet, "id">) => {
    setProjets((prev) => [...prev, { ...p, id: `p-${Date.now()}` }])
  }, [])

  const updateProjet = useCallback((id: string, patch: Partial<Projet>) => {
    setProjets((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const removeProjet = useCallback((id: string) => {
    setProjets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // Un trouble déclaré rend la même charge plus lourde à porter :
  // on réduit la capacité effective et on abaisse un peu l'équilibre.
  const troublesReconnus = ["tdah", "anxiete", "dys", "hpi"]
  // Le profil peut déclarer plusieurs troubles (valeurs séparées par des virgules).
  const troublesDeclares = (profile.trouble ?? "").split(",")
  const aUnTrouble = troublesReconnus.some((t) => troublesDeclares.includes(t))
  const facteurCharge = aUnTrouble ? 0.85 : 1

  // Indice d'équilibre : moyenne pondérée de TOUTES les données de l'accueil
  // (énergie ressentie, capacité utilisée, rythme de travail, concentration).
  const wellbeing = useMemo(() => {
    const clamp = (v: number) => Math.max(0, Math.min(100, v))

    // Énergie ressentie moyenne (0-100, plus haut = mieux).
    const energies = jours.map((j) => j.energie).filter((e) => e > 0)
    const energieMoy = energies.length
      ? energies.reduce((a, b) => a + b, 0) / energies.length
      : wellbeingDefaut.score

    // Rythme de travail : total des heures travaillées par jour (concentration + réunions + perso).
    const rythmes = jours.map((j) => j.focus + j.reunions + j.perso).filter((h) => h > 0)
    const moyenneHeures = rythmes.length
      ? rythmes.reduce((a, b) => a + b, 0) / rythmes.length
      : 0
    const totalFocus = jours.reduce((a, j) => a + j.focus, 0)
    // Moment de pause : moyenne d'heures de pause sur les jours actifs.
    const joursAvecActivite = jours.filter((j) => j.focus + j.reunions + j.perso > 0 || j.pause > 0)
    const moyennePause = joursAvecActivite.length
      ? jours.reduce((a, j) => a + j.pause, 0) / joursAvecActivite.length
      : 0

    // Sous-scores normalisés 0-100 (100 = situation idéale).
    const sEnergie = clamp(energieMoy)
    // Rythme : idéal ≤ 7 h/jour, pénalisé au-delà.
    const sRythme = clamp(100 - Math.max(0, moyenneHeures - 7) * 12)
    // Pauses : ~1 h 30 de pause par jour = idéal.
    const sPause = clamp((moyennePause / 1.5) * 100)
    // Concentration : ~12 h de focus profond sur la semaine = idéal.
    const sFocus = clamp((totalFocus / 12) * 100)

    const brut = Math.round(
      sEnergie * 0.4 + sPause * 0.25 + sRythme * 0.2 + sFocus * 0.15,
    )
    // Un trouble déclaré rend la même charge plus lourde à porter.
    const score = aUnTrouble ? Math.max(0, brut - 8) : brut

    // Qualificatif d'équilibre bienveillant, choisi pour ne pas culpabiliser.
    const ressenti = score >= 75 ? "Belle énergie" : score >= 55 ? "Ça suit" : "En douceur"

    const etat = "Ton équilibre"
    const message =
      score >= 75
        ? "Ton rythme, ta charge et ton énergie tiennent bien. Continue à protéger ce qui fonctionne."
        : score >= 55
          ? "Ton équilibre reste tenable, mais quelques signaux pèsent. On peut alléger ensemble."
          : "Ton équilibre est fragilisé cette semaine. Il est temps de relâcher la pression sur l'essentiel."
    return { score, ressenti, etat, message, tendance: wellbeingDefaut.tendance }
  }, [jours, aUnTrouble, facteurCharge])

  // Indicateurs recalculés à partir des saisies quotidiennes.
  const indicateurs = useMemo<Indicateur[]>(() => {
    // Rythme de travail : total des heures travaillées par jour (concentration + réunions + perso).
    const rythmes = jours.map((j) => j.focus + j.reunions + j.perso).filter((h) => h > 0)
    const moyenneHeures = rythmes.length
      ? rythmes.reduce((a, b) => a + b, 0) / rythmes.length
      : 0
    const totalFocus = jours.reduce((a, j) => a + j.focus, 0)
    // Concentration : moyenne par jour de focus, pour refléter directement les
    // niveaux Faible (2 h) / Modérée (4 h) / Élevée (6 h) choisis dans la chart.
    const joursFocus = jours.filter((j) => j.focus > 0)
    const moyenneFocus = joursFocus.length ? totalFocus / joursFocus.length : 0
    // Moment de pause : total et moyenne sur les jours actifs.
    const totalPause = jours.reduce((a, j) => a + j.pause, 0)
    const joursAvecActivite = jours.filter((j) => j.focus + j.reunions + j.perso > 0 || j.pause > 0)
    const moyennePause = joursAvecActivite.length ? totalPause / joursAvecActivite.length : 0
    const energies = jours.map((j) => j.energie).filter((e) => e > 0)
    const energieMoy = energies.length
      ? Math.round(energies.reduce((a, b) => a + b, 0) / energies.length)
      : 0
    // Ressenti le plus fréquent de la semaine (même logique que l'anneau).
    const compteEnergie = new Map<string, number>()
    energies.forEach((e) => {
      const l = energieLabel(e)
      compteEnergie.set(l, (compteEnergie.get(l) ?? 0) + 1)
    })
    let ressentiFreq = energieLabel(energieMoy)
    let maxOccE = 0
    energieOptions.forEach((o) => {
      const occ = compteEnergie.get(o.label) ?? 0
      if (occ > maxOccE) {
        maxOccE = occ
        ressentiFreq = o.label
      }
    })

    return [
      {
        id: "rythme",
        label: "Rythme de travail",
        valeur: `${round1(moyenneHeures)} h`,
        detail: "moyenne par jour actif",
        statut: statutHeures(moyenneHeures),
        aide:
          moyenneHeures > 7
            ? "Au-dessus de ta limite confortable de 7 h."
            : "Un rythme dans ta zone confortable.",
      },
      {
        id: "focus",
        label: "Temps de concentration",
        // Niveau qualitatif calculé sur la moyenne par jour, calée sur les
        // niveaux saisis dans la chart : Faible (2 h), Modérée (4 h), Élevée (6 h).
        valeur: moyenneFocus >= 5 ? "Élevée" : moyenneFocus >= 3 ? "Modérée" : "Faible",
        detail: `${round1(totalFocus)} h sans interruption`,
        statut: moyenneFocus >= 5 ? "sain" : moyenneFocus >= 3 ? "tendu" : "surcharge",
        aide:
          moyenneFocus >= 5
            ? "Bonne profondeur de travail, continue ainsi."
            : moyenneFocus >= 3
              ? "Une concentration correcte, avec de la marge pour t'approfondir."
              : "Peu de plages de concentration profonde cette semaine.",
      },
      {
        id: "pause",
        label: "Moment de pause",
        valeur: `${round1(totalPause)} h`,
        detail: "de pauses cette semaine",
        statut: statutPause(moyennePause),
        aide:
          moyennePause >= 1
            ? "Tu t'accordes de vraies coupures, c'est ce qui protège ton énergie."
            : moyennePause >= 0.5
              ? "Quelques pauses, mais elles restent courtes. Essaie d'en préserver davantage."
              : "Tu prends très peu de pauses. Bloque de vraies coupures pour souffler.",
      },
      {
        id: "energie",
        label: "Énergie ressentie",
        valeur: ressentiFreq,
        detail: "ressenti le plus fréquent",
        statut: statutEnergie(energieMoy),
        aide:
          energieMoy >= 70
            ? "Ton énergie se maintient bien."
            : "Ton énergie faiblit, pense à récupérer.",
      },
    ]
  }, [jours, aUnTrouble, facteurCharge])

  const value = useMemo<SessionValue>(
    () => ({
      profile,
      jours,
      projets,
      wellbeing,
      indicateurs,
      easePlus,
      toggleEasePlus,
      savedArticles,
      toggleSavedArticle,
      updateProfile,
      updateJour,
      addProjet,
      updateProjet,
      removeProjet,
    }),
    [profile, jours, projets, wellbeing, indicateurs, easePlus, toggleEasePlus, savedArticles, toggleSavedArticle, updateProfile, updateJour, addProjet, updateProjet, removeProjet],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession doit être utilisé dans un SessionProvider")
  return ctx
}
