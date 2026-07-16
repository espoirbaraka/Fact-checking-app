"use client";

import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LOCALES, type Locale } from "@/i18n/locales";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

export function LanguageSelector({ className }: { className?: string }) {
  const { t, locale, setLocale } = useTranslation();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "rounded-lg h-8 gap-1.5 px-2.5 text-muted-foreground",
            className
          )}
          aria-label={t("header.language")}
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-medium max-w-[7rem] truncate">
            {current.nativeLabel}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 max-h-72 overflow-y-auto z-50">
        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => setLocale(item.code as Locale)}
            className={cn(
              "cursor-pointer",
              item.code === locale && "bg-primary/10 text-primary font-medium"
            )}
          >
            <span className="flex flex-col">
              <span className="text-sm">{item.nativeLabel}</span>
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
