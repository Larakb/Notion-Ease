import { cn } from "@/lib/utils"
import { logoDataUri } from "@/lib/logo-data"

// Logo de marque Notion Ease. Le visuel possède déjà sa propre forme (cube),
// donc on l'affiche directement sans fond de couleur. L'image est inlinée en
// data URI (base64) : aucune requête réseau n'est nécessaire, donc l'affichage
// est instantané et sans clignotement, y compris lors des changements de page.
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoDataUri || "/placeholder.svg"}
      alt="Notion Ease"
      width={64}
      height={64}
      decoding="sync"
      className={cn("object-contain", className)}
    />
  )
}
