"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { cn } from "@/utils/cn";

interface UserProfileProps {
  collapsed?: boolean;
  /** Compact avatar-only control for the top header */
  variant?: "sidebar" | "header";
}

export function UserProfile({
  collapsed = false,
  variant = "sidebar",
}: UserProfileProps) {
  const router = useRouter();
  const { user, logout: clearAuth } = useAuthStore();
  const { clearChat, setSessions } = useChatStore();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    clearChat();
    setSessions([]);
    router.replace("/login");
  };

  const isHeader = variant === "header";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 rounded-xl transition-colors cursor-pointer outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            isHeader
              ? "rounded-full p-0.5 hover:opacity-90"
              : "w-full p-2 hover:bg-accent"
          )}
          aria-label="Menu utilisateur"
        >
          <Avatar className={cn(isHeader ? "h-8 w-8" : "h-9 w-9")}>
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className={cn(isHeader && "text-xs")}>
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isHeader && !collapsed && (
            <div className="flex flex-col items-start text-left min-w-0">
              <span className="text-sm font-medium truncate w-full">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground truncate w-full">
                {user.email}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-50">
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span className="truncate">{user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
          Mes vérifications
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/about" className="cursor-pointer">
            <Info className="mr-2 h-4 w-4" />
            À propos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
