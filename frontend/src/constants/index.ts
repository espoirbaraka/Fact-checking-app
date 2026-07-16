import type { AIModel, NavItem, Plugin } from "@/types";

export const APP_NAME = "CHUNGUZA";
export const APP_DESCRIPTION =
  "Plateforme de fact-checking assistée par IA pour le Nord-Kivu, zone de conflit armé";

export const CREATOR = {
  name: "Baraka Bigega Espoir",
  role: "Concepteur & développeur",
  phone: "+243977553723",
  phoneHref: "tel:+243977553723",
  email: "esbarakabigega@gmail.com",
  emailHref: "mailto:esbarakabigega@gmail.com",
  github: "https://github.com/espoirbaraka",
  linkedin: "https://www.linkedin.com/in/espoir-baraka-38394018a/",
  location: "Goma, Nord-Kivu, RD Congo",
} as const;

export const AI_MODELS: { id: AIModel; label: string; description: string }[] =
  [
    {
      id: "qwen",
      label: "Qwen",
      description: "Modèle local via Ollama, adapté au multilinguisme",
    },
    {
      id: "gpt-4",
      label: "Analyse approfondie",
      description: "Réponses détaillées pour les affirmations complexes",
    },
    {
      id: "gpt-3.5",
      label: "Réponse rapide",
      description: "Vérification courte des rumeurs et posts",
    },
  ];

export const PLUGINS: Plugin[] = [
  {
    id: "fact-check",
    name: "Fact-check",
    description: "Vérifie une rumeur ou affirmation",
    icon: "shield-check",
  },
  {
    id: "source-finder",
    name: "Sources",
    description: "Repère des sources crédibles (ONG, radio, presse)",
    icon: "search",
  },
  {
    id: "bias-detector",
    name: "Biais / manip",
    description: "Repère la manipulation et les cadres émotionnels",
    icon: "scale",
  },
  {
    id: "translation",
    name: "Traduction",
    description: "Aide FR / swahili / lingala pour vérifier",
    icon: "languages",
  },
];

export const SIDEBAR_NAV: NavItem[] = [
  { id: "chat", label: "Vérification", href: "/chat", icon: "message-square-plus" },
  { id: "projects", label: "Dossiers", href: "/chat", icon: "folder-kanban" },
  { id: "prompts", label: "Guides", href: "/chat", icon: "file-text" },
];

export const SIDEBAR_AUTH: NavItem[] = [
  { id: "register", label: "Créer un compte", href: "/chat", icon: "user-plus" },
  { id: "signin", label: "Connexion", href: "/chat", icon: "log-in" },
];

export const SIDEBAR_ADMIN: NavItem[] = [
  { id: "admin", label: "Équipe", href: "/chat", icon: "shield", badge: "Local" },
];

export const VERIFICATION_STATUS_CONFIG = {
  verified: {
    label: "Oui",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  uncertain: {
    label: "Incertain",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  false: {
    label: "Non",
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
  },
} as const;
