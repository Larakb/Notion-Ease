"use client"

import { useState } from "react"
import { BookOpen, Bookmark, Clock } from "lucide-react"
import { ressources, type Ressource } from "@/lib/data"
import { useSession } from "@/lib/session-store"
import { Card, SectionTitle } from "./primitives"
import { ArticleReader } from "./article-reader"
import { cn } from "@/lib/utils"

export function SectionRessources() {
  const [article, setArticle] = useState<Ressource | null>(null)
  const { savedArticles, toggleSavedArticle } = useSession()

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Ressources"
        title="Pour aller plus loin, en douceur"
        description="Des lectures courtes pour mieux comprendre ta charge de travail et construire des habitudes plus saines."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ressources.map((r) => {
          const lisible = Boolean(r.contenu?.length)
          const enregistre = savedArticles.includes(r.titre)
          return (
            <Card
              key={r.titre}
              onClick={lisible ? () => setArticle(r) : undefined}
              role={lisible ? "button" : undefined}
              tabIndex={lisible ? 0 : undefined}
              onKeyDown={
                lisible
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setArticle(r)
                      }
                    }
                  : undefined
              }
              className={`group relative flex flex-col gap-3 overflow-hidden transition-colors hover:border-primary/40 ${
                lisible ? "cursor-pointer" : ""
              }`}
            >
              {/* Bouton d'enregistrement, en surimpression */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSavedArticle(r.titre)
                }}
                aria-pressed={enregistre}
                aria-label={enregistre ? `Retirer ${r.titre} des articles enregistrés` : `Enregistrer ${r.titre}`}
                className={cn(
                  "absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border backdrop-blur transition-colors",
                  enregistre
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/85 text-foreground hover:border-primary/40",
                )}
              >
                <Bookmark className={cn("size-4", enregistre && "fill-current")} aria-hidden />
              </button>

              {r.image ? (
                <div className="-mx-5 -mt-5 mb-1 aspect-[16/10] overflow-hidden border-b border-border bg-[#f5f4f0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image || "/placeholder.svg"}
                    alt=""
                    className="size-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {r.categorie}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden />
                  {r.lecture}
                </span>
              </div>
              <h3 className="text-pretty font-heading text-base font-semibold leading-snug text-foreground">
                {r.titre}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {r.extrait}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-primary">
                <BookOpen className="size-4" aria-hidden />
                Lire l'article
              </span>
            </Card>
          )
        })}
      </div>

      {article ? (
        <ArticleReader article={article} onClose={() => setArticle(null)} />
      ) : null}
    </div>
  )
}
