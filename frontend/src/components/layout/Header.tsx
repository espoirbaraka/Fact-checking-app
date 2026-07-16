"use client";

import Link from "next/link";
import { Bell, Info, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { UserProfile } from "@/components/layout/UserProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/chat.store";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

export function Header() {
  const { toggleSidebar, sessionSearch, setSessionSearch, setSidebarOpen } =
    useChatStore();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-[var(--header-height)] items-center gap-4 border-b bg-card/80 backdrop-blur-md px-4 lg:px-6"
      )}
    >
      {isMobile && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={t("nav.search")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={sessionSearch}
          onChange={(e) => {
            setSessionSearch(e.target.value);
            if (isMobile) setSidebarOpen(true);
          }}
          placeholder={t("header.searchPlaceholder")}
          className="pl-9 pr-9 bg-muted/50 border-0 rounded-xl h-9"
          aria-label={t("header.searchPlaceholder")}
        />
        {sessionSearch && (
          <button
            type="button"
            onClick={() => setSessionSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={t("common.close")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        <LanguageSelector />

        <Button
          variant="outline"
          size="sm"
          asChild
          className="rounded-lg h-8 gap-1.5 px-2.5 border-primary/20 text-primary hover:bg-primary/5"
        >
          <Link href="/about">
            <Info className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">
              {t("header.about")}
            </span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full relative"
          aria-label={t("header.notifications")}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <ThemeToggle />

        <UserProfile variant="header" />
      </div>
    </header>
  );
}
