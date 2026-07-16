"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Code2,
  Mail,
  MapPin,
  Phone,
  Radio,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { APP_DESCRIPTION, APP_NAME, CREATOR } from "@/constants";
import { cn } from "@/utils/cn";

const contactLinks = [
  {
    label: "Téléphone",
    value: CREATOR.phone,
    href: CREATOR.phoneHref,
    icon: Phone,
  },
  {
    label: "Email",
    value: CREATOR.email,
    href: CREATOR.emailHref,
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "espoirbaraka",
    href: CREATOR.github,
    icon: Code2,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "Espoir Baraka",
    href: CREATOR.linkedin,
    icon: Briefcase,
    external: true,
  },
] as const;

export function AboutPageContent() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/chat"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la vérification
        </Link>

        <div className="mb-8">
          <Logo size="md" className="mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            À propos de {APP_NAME}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {APP_DESCRIPTION}
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Pourquoi cette application ?
          </h2>
          <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-foreground/90">
            <p>
              Au Nord-Kivu, les rumeurs circulent vite (WhatsApp, radio, bouche
              à oreille) dans un contexte de conflit armé où une fausse
              information peut mettre des vies en danger ou attiser les tensions.
            </p>
            <p>
              <strong className="font-semibold text-foreground">{APP_NAME}</strong>{" "}
              aide les citoyens, journalistes communautaires et acteurs humanitaires
              à vérifier rapidement une affirmation, un message ou un document
              (image / PDF), en croisant des sources crédibles et en affichant un
              verdict clair : Oui ou Non, avec un niveau de confiance.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            À quoi ça sert ?
          </h2>
          <ul className="space-y-3">
            {[
              {
                icon: ShieldCheck,
                title: "Vérifier une rumeur",
                text: "Collez un texte ou une question ; l’IA recherche des sources et propose un verdict.",
              },
              {
                icon: Smartphone,
                title: "Analyser une capture ou un PDF",
                text: "Joignez une image WhatsApp ou un document : le texte est lu (OCR) puis vérifié.",
              },
              {
                icon: Radio,
                title: "Rester prudent",
                text: "L’outil complète, sans remplacer, la radio communautaire, les ONG et les autorités locales.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-xl border border-border/70 bg-card/50 px-3.5 py-3"
              >
                <item.icon className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Concepteur
          </h2>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-lg font-semibold">{CREATOR.name}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{CREATOR.role}</p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {CREATOR.location}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              Développeur web (PHP, Laravel, React, Django), basé à Goma. Ce projet
              vise à renforcer la lutte contre la désinformation dans l’Est de la
              RD Congo grâce à l’IA et à des sources locales fiables.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm",
                      "hover:bg-accent/60 hover:border-primary/25 transition-colors"
                    )}
                  >
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                        {link.label}
                      </span>
                      <span className="block truncate font-medium">{link.value}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <p className="text-xs text-muted-foreground text-center pb-4">
          {APP_NAME} : outil d’aide à la vérification, pas une source officielle.
        </p>
      </div>
    </div>
  );
}
