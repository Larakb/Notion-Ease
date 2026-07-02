// Données simulées pour la démo Notion Ease.
// Tout est statique et réaliste, aucune donnée réelle n'est collectée.

// Profil renseigné pendant l'onboarding et affiché dans l'application.
export type Profile = {
  name: string
  profil: string
  objectif?: string
  fatigue?: string
  trouble?: string // trouble déclaré, pris en compte dans le calcul de la charge
}

export const user = {
  name: "Lina",
  profil: "Alternante",
  semaine: "Semaine du 22 au 28 juin",
}

// Options du profil, reprises telles quelles depuis l'onboarding,
// pour proposer les mêmes choix dans les menus déroulants de « Mes données ».
export const profilOptions = ["Étudiant·e", "Jeune actif·ve", "Freelance"]

export const objectifOptions = [
  "Mieux répartir ma charge",
  "M'accorder plus de pauses",
  "Mieux déconnecter le soir",
  "Comprendre mes limites",
]

export const fatigueOptions = [
  "Trop de tâches en même temps",
  "Le manque de pauses",
  "Les notifications constantes",
  "La difficulté à déconnecter",
]

// Indice d'équilibre (0 à 100). Plus haut = plus équilibré.
export const wellbeing = {
  score: 68,
  tendance: +5, // vs semaine précédente
  etat: "Équilibre fragile",
  message:
    "Ton rythme reste tenable, mais deux journées de surcharge se profilent. On peut alléger ensemble.",
}

// Indicateurs clés de la semaine
export const indicateurs = [
  {
    id: "rythme",
    label: "Rythme de travail",
    valeur: "7 h 40",
    detail: "moyenne par jour",
    statut: "tendu" as const,
    aide: "Au-dessus de ta limite confortable de 7 h.",
  },
  {
    id: "pauses",
    label: "Pauses respectées",
    valeur: "61 %",
    detail: "des pauses prévues",
    statut: "tendu" as const,
    aide: "Tu sautes souvent ta pause de l'après-midi.",
  },
  {
    id: "deconnexion",
    label: "Déconnexion du soir",
    valeur: "3 / 7",
    detail: "soirées protégées",
    statut: "surcharge" as const,
    aide: "4 soirées de travail après 21 h cette semaine.",
  },
  {
    id: "focus",
    label: "Temps de concentration",
    valeur: "12 h",
    detail: "sans interruption",
    statut: "sain" as const,
    aide: "Bonne profondeur de travail, continue ainsi.",
  },
]

export type Statut = "sain" | "tendu" | "surcharge"

// Charge par jour de la semaine (en heures)
export const semaine = [
  { jour: "Lundi", focus: 4, reunions: 1.5, perso: 1, capacite: 7 },
  { jour: "Mardi", focus: 5, reunions: 2, perso: 0.5, capacite: 7 },
  { jour: "Mercredi", focus: 3, reunions: 4, perso: 0, capacite: 7 },
  { jour: "Jeudi", focus: 6, reunions: 3, perso: 0, capacite: 7 },
  { jour: "Vendredi", focus: 5.5, reunions: 3.5, perso: 0, capacite: 7 },
  { jour: "Samedi", focus: 2, reunions: 0, perso: 1, capacite: 4 },
  { jour: "Dimanche", focus: 0.5, reunions: 0, perso: 0.5, capacite: 3 },
]

// Évolution de la charge de travail sur 8 semaines
export const evolution = [
  { semaine: "S18", charge: 58, capacite: 100 },
  { semaine: "S19", charge: 64, capacite: 100 },
  { semaine: "S20", charge: 72, capacite: 100 },
  { semaine: "S21", charge: 61, capacite: 100 },
  { semaine: "S22", charge: 79, capacite: 100 },
  { semaine: "S23", charge: 88, capacite: 100 },
  { semaine: "S24", charge: 74, capacite: 100 },
  { semaine: "S25", charge: 83, capacite: 100 },
]

// Vue historique : la charge sur les 12 derniers mois (pour la vue « Année »).
export const evolutionAnnee = [
  { periode: "Juil.", charge: 62 },
  { periode: "Août", charge: 41 },
  { periode: "Sept.", charge: 70 },
  { periode: "Oct.", charge: 78 },
  { periode: "Nov.", charge: 74 },
  { periode: "Déc.", charge: 55 },
  { periode: "Janv.", charge: 68 },
  { periode: "Févr.", charge: 72 },
  { periode: "Mars", charge: 81 },
  { periode: "Avril", charge: 77 },
  { periode: "Mai", charge: 84 },
  { periode: "Juin", charge: 79 },
]

// Historique des périodes passées, que l'utilisateur peut retrouver et consulter.
export type PeriodeHistorique = {
  periode: string
  score: number // indice d'équilibre moyen (0-100)
  ressenti: string
  chargeMoy: number // charge moyenne en %
  heuresMoy: number // heures travaillées par jour en moyenne
}

export const historiqueMois: PeriodeHistorique[] = [
  { periode: "Juin 2026", score: 71, ressenti: "Ça suit", chargeMoy: 79, heuresMoy: 7.4 },
  { periode: "Mai 2026", score: 58, ressenti: "En douceur", chargeMoy: 84, heuresMoy: 8.1 },
  { periode: "Avril 2026", score: 66, ressenti: "Ça suit", chargeMoy: 77, heuresMoy: 7.6 },
  { periode: "Mars 2026", score: 61, ressenti: "En douceur", chargeMoy: 81, heuresMoy: 7.9 },
  { periode: "Février 2026", score: 74, ressenti: "Belle énergie", chargeMoy: 72, heuresMoy: 6.9 },
  { periode: "Janvier 2026", score: 69, ressenti: "Ça suit", chargeMoy: 68, heuresMoy: 6.7 },
]

export const historiqueAnnee: PeriodeHistorique[] = [
  { periode: "Année 2025", score: 64, ressenti: "Ça suit", chargeMoy: 76, heuresMoy: 7.5 },
  { periode: "Année 2024", score: 70, ressenti: "Ça suit", chargeMoy: 71, heuresMoy: 7.1 },
]

export const projets = [
  {
    nom: "Mémoire de fin d'études",
    charge: 92,
    taches: 14,
    echeance: "Dans 9 jours",
    statut: "surcharge" as Statut,
  },
  {
    nom: "Lancement campagne : Entreprise",
    charge: 78,
    taches: 9,
    echeance: "Dans 4 jours",
    statut: "tendu" as Statut,
  },
  {
    nom: "Révisions partiels",
    charge: 54,
    taches: 6,
    echeance: "Dans 12 jours",
    statut: "tendu" as Statut,
  },
  {
    nom: "Side project : Portfolio",
    charge: 23,
    taches: 4,
    echeance: "Pas de date",
    statut: "sain" as Statut,
  },
]

// Périodes de surcharge détectées
export const surcharges = [
  {
    fenetre: "Jeudi & Vendredi",
    cause: "3 échéances rapprochées + 6 h de réunions",
    intensite: "Élevée",
    statut: "surcharge" as Statut,
  },
  {
    fenetre: "Mercredi après-midi",
    cause: "Journée fragmentée par les réunions, peu de focus",
    intensite: "Modérée",
    statut: "tendu" as Statut,
  },
]

export const recommandations = [
  {
    id: 1,
    titre: "Décale une échéance",
    corps:
      "Ton mémoire et la campagne tombent la même semaine. Le portfolio peut attendre : repousse-le sans culpabiliser, il n'a pas de date imposée.",
    type: "Alléger la charge",
    priorite: "Prioritaire" as const,
  },
  {
    id: 2,
    titre: "Protège tes jeudis soir",
    corps:
      "Tu as travaillé après 21 h 4 soirs cette semaine. Bloque un créneau « hors-ligne » jeudi soir pour vraiment récupérer avant la fin de semaine chargée.",
    type: "Préserver l'énergie",
    priorite: "Prioritaire" as const,
  },
  {
    id: 3,
    titre: "Regroupe tes réunions du mercredi",
    corps:
      "Ta journée de mercredi est très fragmentée. Propose de regrouper les points en début d'après-midi pour libérer une vraie plage de concentration.",
    type: "Mieux répartir",
    priorite: "Conseillé" as const,
  },
  {
    id: 4,
    titre: "Réintègre ta pause de l'après-midi",
    corps:
      "Tu sautes ta pause de 16 h dans 6 cas sur 10. Une courte coupure de 10 minutes suffit à relancer ta concentration pour la fin de journée.",
    type: "Préserver l'énergie",
    priorite: "Conseillé" as const,
  },
]

export type Ressource = {
  titre: string
  extrait: string
  lecture: string
  categorie: string
  image?: string
  contenu?: string[]
}

export const ressources: Ressource[] = [
  {
    titre: "Comprendre sa charge de travail au quotidien",
    extrait:
      "Ce que c'est, pourquoi elle s'accumule sans bruit, et comment la repérer avant l'épuisement.",
    lecture: "5 min",
    categorie: "Comprendre",
    image: "/ressources/charge-quotidienne.webp",
    contenu: [
      "La charge de travail n'est pas seulement une question d'heures. C'est la somme de tout ce que ton cerveau doit porter : les tâches en cours, celles que tu anticipes, les décisions à prendre et les sollicitations qui s'accumulent au fil de la journée.",
      "Le piège, c'est qu'elle grandit sans bruit. On ajoute une réunion, on accepte une demande « rapide », on repousse une pause. Prises isolément, ces micro-décisions semblent anodines. Mises bout à bout, elles finissent par saturer tes journées sans que tu t'en rendes compte.",
      "Pour la repérer, observe trois signaux simples : la difficulté à démarrer une tâche pourtant familière, le sentiment de courir sans avancer, et les soirées qui débordent sur le travail. Quand deux de ces signaux reviennent plusieurs jours de suite, c'est que ta charge dépasse ta capacité réelle.",
      "La bonne nouvelle : une charge repérée tôt se réajuste facilement. Il suffit souvent de protéger une plage de concentration, de repousser une échéance non urgente, ou de dire non à une seule sollicitation. C'est exactement ce que Notion Ease t'aide à voir avant que la fatigue ne s'installe.",
    ],
  },
  {
    titre: "Apprendre à dire non sans culpabiliser",
    extrait:
      "Des formulations concrètes pour poser tes limites au travail comme dans tes études.",
    lecture: "4 min",
    categorie: "Limites",
    image: "/ressources/dire-non.jpg",
    contenu: [
      "Dire non, ce n'est pas fermer la porte : c'est protéger ce à quoi tu as déjà dit oui. Chaque engagement que tu acceptes en trop retire du temps et de l'énergie à ce qui compte vraiment pour toi.",
      "La clé, c'est de refuser la tâche sans rejeter la personne. Reconnais la demande, explique ta contrainte, puis propose une alternative : « Merci d'avoir pensé à moi. Je suis déjà pris cette semaine, mais je peux regarder ça la semaine prochaine. »",
      "Évite de te justifier à l'excès. Une raison courte et honnête suffit ; enchaîner les explications donne l'impression que ta limite est négociable. Un « non » calme et clair est plus respecté qu'un « oui » hésitant.",
      "Enfin, entraîne-toi sur les petits refus du quotidien. Plus tu poses de limites simples, plus il devient naturel d'en poser sur les enjeux importants, sans que la culpabilité prenne le dessus.",
    ],
  },
  {
    titre: "La productivité durable, mode d'emploi",
    extrait:
      "Travailler moins fort, plus longtemps : comment construire un rythme qui tient sur la durée.",
    lecture: "7 min",
    categorie: "Méthode",
    image: "/ressources/product.png",
    contenu: [
      "La productivité durable renverse une idée reçue : la performance ne vient pas de l'intensité maximale, mais de la régularité. Un rythme que tu peux tenir des mois vaut mieux qu'un sprint qui se termine en épuisement.",
      "Le premier levier est la protection de l'attention. Les notifications fragmentent ta concentration et chaque interruption coûte plusieurs minutes de reprise. Regrouper tes messages en quelques créneaux dédiés libère de vraies plages de travail profond.",
      "Le deuxième levier est l'alternance effort/récupération. Ton cerveau fonctionne par cycles : après 60 à 90 minutes de concentration, une vraie pause n'est pas du temps perdu, c'est ce qui rend la séquence suivante possible.",
      "Le troisième levier est la marge. Une semaine remplie à 100 % n'a aucune tolérance aux imprévus. Viser 80 % de charge planifiée laisse de la place pour l'inattendu, et transforme les urgences en simples ajustements.",
      "La productivité durable, ce n'est donc pas faire plus. C'est construire un système où ton meilleur travail reste possible, semaine après semaine, sans y laisser ta santé.",
    ],
  },
  {
    titre: "Alternance : mener deux vies sans s'épuiser",
    extrait:
      "Des repères pour cloisonner études et entreprise et vraiment déconnecter entre les deux.",
    lecture: "6 min",
    categorie: "Alternance",
    image: "/ressources/alternance.png",
    contenu: [
      "L'alternance a une exigence cachée : passer sans cesse d'un monde à l'autre. Le rythme scolaire et le rythme de l'entreprise ont leurs propres codes, leurs échéances et leurs attentes, et ton cerveau paie le coût de chaque bascule.",
      "Le premier repère est le cloisonnement. Définis clairement ce qui appartient à l'école et ce qui appartient au travail, y compris dans ton agenda. Mélanger les deux en permanence, c'est n'être jamais vraiment présent nulle part.",
      "Le deuxième repère est le rituel de transition. Un court trajet, une liste de fin de journée, quelques minutes pour ranger : ces gestes signalent à ton esprit qu'un chapitre se ferme et qu'un autre s'ouvre.",
      "Le troisième repère est la protection des zones de récupération. Entre deux univers exigeants, tes soirées et tes week-ends ne sont pas des variables d'ajustement : ce sont eux qui rendent l'alternance tenable sur toute l'année.",
      "Enfin, accepte de ne pas tout mener de front à 100 %. Certaines semaines penchent vers l'école, d'autres vers l'entreprise. Suivre cet équilibre plutôt que de le nier t'évite de courir après un idéal impossible.",
    ],
  },
  {
    titre: "Reconnaître les signaux de surcharge",
    extrait:
      "Sommeil, irritabilité, perte de sens : les signes faibles à ne pas ignorer.",
    lecture: "3 min",
    categorie: "Bien-être",
      image: "/ressources/surcharge.png",
  },
  {
    titre: "Construire des semaines réalistes",
    extrait:
      "Pourquoi nos to-do lists sont trop ambitieuses et comment planifier avec marge.",
    lecture: "5 min",
    categorie: "Méthode",
      image: "/ressources/semaine.png",
  },
]

export const faq = [
  {
    q: "Est-ce que Notion Ease lit le contenu de mes pages ?",
    r: "Non. L'analyse porte uniquement sur des métadonnées de rythme (volume de tâches, échéances, plages horaires). Le contenu de tes notes n'est jamais consulté.",
  },
  {
    q: "Mes données sont-elles partagées ?",
    r: "Jamais. Tes analyses restent privées et ne sont ni revendues, ni partagées avec ton entreprise ou ton école.",
  },
  {
    q: "Les indicateurs sont-ils des objectifs à atteindre ?",
    r: "Non, ce sont des repères pour t'aider à décider, pas des notes à maximiser. Tu restes libre de ton rythme.",
  },
]

export const statutStyles: Record<
  Statut,
  { dot: string; texte: string; fond: string; libelle: string }
> = {
  sain: {
    dot: "bg-primary",
    texte: "text-primary",
    fond: "bg-accent",
    libelle: "Serein",
  },
  tendu: {
    dot: "bg-[#f6d6c9]",
    texte: "text-[#b06a4c]",
    fond: "bg-[#fdf1ec]",
    libelle: "Tendu",
  },
  surcharge: {
    dot: "bg-[#f6d6c9]",
    texte: "text-[#b06a4c]",
    fond: "bg-[#fdf1ec]",
    libelle: "Surcharge",
  },
}
