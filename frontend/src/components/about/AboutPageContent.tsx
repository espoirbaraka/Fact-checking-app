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
import { APP_NAME, CREATOR } from "@/constants";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

export function AboutPageContent() {
  const { t } = useTranslation();

  const contactLinks = [
    {
      labelKey: "about.phone" as const,
      value: CREATOR.phone,
      href: CREATOR.phoneHref,
      icon: Phone,
    },
    {
      labelKey: "about.email" as const,
      value: CREATOR.email,
      href: CREATOR.emailHref,
      icon: Mail,
    },
    {
      labelKey: "about.github" as const,
      value: "espoirbaraka",
      href: CREATOR.github,
      icon: Code2,
      external: true,
    },
    {
      labelKey: "about.linkedin" as const,
      value: "Espoir Baraka",
      href: CREATOR.linkedin,
      icon: Briefcase,
      external: true,
    },
  ];

  const utilities = [
    {
      icon: ShieldCheck,
      title: t("about.utility1Title"),
      text: t("about.utility1Text"),
    },
    {
      icon: Smartphone,
      title: t("about.utility2Title"),
      text: t("about.utility2Text"),
    },
    {
      icon: Radio,
      title: t("about.utility3Title"),
      text: t("about.utility3Text"),
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/chat"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("about.back")}
        </Link>

        <div className="mb-8">
          <Logo size="md" className="mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {t("about.title")}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t("chat.tagline")}
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t("about.whyTitle")}
          </h2>
          <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-foreground/90">
            <p>{t("about.whyP1")}</p>
            <p>{t("about.whyP2")}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t("about.utilityTitle")}
          </h2>
          <ul className="space-y-3">
            {utilities.map((item) => (
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
            {t("about.creatorTitle")}
          </h2>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-lg font-semibold">{CREATOR.name}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("about.creatorRole")}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {CREATOR.location}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              {t("about.creatorBio")}
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.labelKey}
                    href={link.href}
                    {...(link.external
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
                        {t(link.labelKey)}
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
          {t("about.footer")}
        </p>
      </div>
    </div>
  );
}
