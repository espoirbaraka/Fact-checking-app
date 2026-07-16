"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { UserProfile } from "@/components/layout/UserProfile";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat.store";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

export function Header() {
  const { toggleSidebar } = useChatStore();
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

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        <ThemeToggle />
        <UserProfile variant="header" />
      </div>
    </header>
  );
}
