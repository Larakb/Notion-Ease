"use client"

import { useEffect } from "react"
import { Bookmark, Clock, X } from "lucide-react"
import type { Ressource } from "@/lib/data"
import { useSession } from "@/lib/session-store"
import { cn } from "@/lib/utils"

// Lecteur d'article en surcouche, fermable au clavier (Échap) ou au clic hors contenu.
export function ArticleReader({
  article,
  onClose,
}: {
  article: Ressource
  onClose: () => void
}) {
  const { savedArticles, toggleSavedArticle } = useSession()
  const enregistre = savedArticles.includes(article.titre)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={article.titre}
    >
      <article
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer l'article"
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-secondary"
        >
          <X className="size-4" aria-hidden />
        </button>

        {article.image ? (
          <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-[#f5f4f0]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image || "/placeholder.svg"}
              alt=""
              className="size-full object-contain"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {article.categorie}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              {article.lecture} de lecture
            </span>
          </div>

          <h2 className="text-balance font-heading text-2xl font-semibold leading-tight text-foreground">
            {article.titre}
          </h2>

          <div className="flex flex-col gap-4">
            {article.contenu?.map((paragraphe, i) => (
              <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                {paragraphe}
              </p>
            ))}
          </div>

          {/* Signature de l'article */}
          <p className="mt-2 border-t border-border pt-4 text-sm font-medium italic text-muted-foreground">
            Écrit par Notion Ease
          </p>

          {/* Enregistrer / retirer des articles sauvegardés */}
          <button
            onClick={() => toggleSavedArticle(article.titre)}
            aria-pressed={enregistre}
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              enregistre
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-primary/40",
            )}
          >
            <Bookmark className={cn("size-4", enregistre && "fill-current")} aria-hidden />
            {enregistre ? "Article enregistré" : "Enregistrer l'article"}
          </button>
        </div>
      </article>
    </div>
  )
}
