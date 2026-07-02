"use client"

import { ArrowLeft } from "lucide-react"
import { Logo } from "./logo"

export function WelcomeScreen({
  onLogin,
  onBack,
}: {
  onLogin: () => void
  onBack: () => void
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#191919] px-6 text-[#e3e3e3]">
      <button
        onClick={onBack}
        className="absolute left-5 top-5 inline-flex items-center gap-1.5 text-sm text-[#9b9b9b] transition-colors hover:text-[#e3e3e3]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Retour à Notion
      </button>

      <div className="flex w-full max-w-md flex-col items-center text-center">
        <Logo className="size-16" />

        <h1 className="mt-8 font-heading text-3xl font-bold tracking-tight text-white">
          Bienvenue dans <br />Notion Ease
        </h1>
        <p className="mt-0,5 max-w-sm text-pretty font-heading font-bold leading-relaxed text-[#7F7A76]">
          Organise ton travail sans sacrifier ta santé mentale. Un espace plus humain,
          directement dans Notion.
        </p>

        <div className="my-8 h-px w-full bg-white/10" />

        <p className="font-sans text-sm text-[#7F7A76]">
          Utiliser le compte Notion{" "}
          <span className="text-[#7F7A76]">lara@kalia-na…</span>{" "}
          <button className="text-emerald-400 transition-colors hover:text-emerald-300">
            Changer
          </button>
        </p>

        <button
          onClick={onLogin}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg bg-[#A7C8A0] px-4 py-3.5 text-sm font-semibold text-[#191919] transition-opacity hover:opacity-90"
        >
          Continuer avec Notion
        </button>
      </div>

      <p className="absolute bottom-8 max-w-md px-6 text-center text-xs leading-relaxed text-[#6b6b6b]">
        En continuant, tu reconnais avoir lu, compris et accepté les Conditions générales
        de Notion et la Politique de confidentialité applicable à ton utilisation de Notion
        Ease.
      </p>
    </main>
  )
}
