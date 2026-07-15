"use client";

import { Bell, Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/cn";

export function Header() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useChatStore();
  const isMobile = useIsMobile();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher une vérification…"
          className="pl-9 bg-muted/50 border-0 rounded-xl h-9"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <ThemeToggle />

        <Avatar className="h-8 w-8 cursor-pointer">
          {user?.avatar && (
            <AvatarImage src={user.avatar} alt={user?.name} />
          )}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
