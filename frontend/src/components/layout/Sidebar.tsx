"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  Info,
  Key,
  MessageSquarePlus,
  Radio,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/components/layout/UserProfile";
import { useChatStore } from "@/store/chat.store";
import { useSettingsStore } from "@/store/settings.store";
import { chatService } from "@/services/chat.service";
import { cn } from "@/utils/cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n/useTranslation";
import { APP_NAME } from "@/constants";

interface SidebarContentProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarContent({
  collapsed = false,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sessions,
    newChat,
    setActiveSession,
    setMessages,
    activeSessionId,
    sessionSearch,
    setSessionSearch,
    removeSession,
  } = useChatStore();
  const { apiKey, setApiKey } = useSettingsStore();
  const [apiKeyInput, setApiKeyInput] = useState(apiKey ?? "");
  const [searchOpen, setSearchOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredSessions = useMemo(() => {
    const q = sessionSearch.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, sessionSearch]);

  const handleNewChat = () => {
    newChat();
    setSessionSearch("");
    router.push("/chat");
    onNavigate?.();
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const handleOpenSession = async (id: string) => {
    try {
      const session = await chatService.getSession(id);
      if (!session) return;
      setActiveSession(session.id);
      setMessages(session.messages);
      router.push("/chat");
      onNavigate?.();
    } catch {
      setActiveSession(id);
      router.push("/chat");
      onNavigate?.();
    }
  };

  const handleGoHome = () => {
    newChat();
    setSessionSearch("");
    router.push("/chat");
    onNavigate?.();
  };

  const { t } = useTranslation();
  const aboutActive = pathname.startsWith("/about");

  const handleDeleteSession = async (
    event: React.MouseEvent,
    id: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(t("nav.deleteConfirm"))) return;

    setDeletingId(id);
    try {
      await chatService.deleteSession(id);
      removeSession(id);
      if (activeSessionId === id) {
        newChat();
        router.push("/chat");
      }
    } catch (error) {
      console.error("Failed to delete session", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-4 pb-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={APP_NAME}
        >
          <Logo size={collapsed ? "sm" : "md"} showText={!collapsed} />
        </button>
      </div>

      <div className="px-3 py-2 space-y-1">
        <Button
          onClick={handleNewChat}
          className={cn(
            "w-full justify-start gap-2 rounded-xl",
            collapsed && "justify-center px-0"
          )}
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0" />
          {!collapsed && t("nav.newCheck")}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={handleOpenSearch}
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-0",
            (searchOpen || sessionSearch) && "bg-accent text-foreground"
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          {!collapsed && t("nav.search")}
        </Button>

        {(searchOpen || sessionSearch) && !collapsed && (
          <div className="relative pt-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="pl-9 pr-8 h-9 rounded-xl bg-muted/50 border-0"
              aria-label={t("nav.search")}
            />
            {sessionSearch && (
              <button
                type="button"
                onClick={() => {
                  setSessionSearch("");
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label={t("common.close")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <Separator className="mx-3" />

      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          <Link
            href="/about"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
              aboutActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <Info className="h-4 w-4 shrink-0" />
            {!collapsed && t("nav.about")}
          </Link>
        </nav>

        {!collapsed && (
          <>
            <div className="mt-4 mb-2 px-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("nav.myChecks")}
              </span>
              {sessionSearch && (
                <span className="text-[10px] text-muted-foreground">
                  {filteredSessions.length}/{sessions.length}
                </span>
              )}
            </div>
            <nav className="space-y-0.5">
              {sessions.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  {t("nav.noChecks")}
                </p>
              )}
              {sessions.length > 0 && filteredSessions.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  {t("nav.noResults", { query: sessionSearch })}
                </p>
              )}
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative flex w-full items-center rounded-xl text-sm transition-colors",
                    activeSessionId === session.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenSession(session.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{session.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => handleDeleteSession(event, session.id)}
                    disabled={deletingId === session.id}
                    className={cn(
                      "mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                      "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
                      "transition-opacity disabled:opacity-50",
                      activeSessionId === session.id && "sm:opacity-100"
                    )}
                    aria-label={t("nav.deleteCheck")}
                    title={t("nav.deleteCheck")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </nav>
          </>
        )}
      </ScrollArea>

      {!collapsed && (
        <div className="px-3 py-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5f4a] to-[#0f3d30] p-4 text-white"
          >
            <div className="absolute top-2 right-2 opacity-20">
              <Radio className="h-16 w-16" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Radio className="h-4 w-4" />
                <span className="font-semibold text-sm">{t("nav.localContext")}</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                {t("nav.localContextText")}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      <div className="px-3 py-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full gap-2 rounded-xl",
                collapsed && "px-0 justify-center"
              )}
            >
              <Key className="h-4 w-4 shrink-0" />
              {!collapsed && t("nav.apiKey")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("nav.apiKey")}</DialogTitle>
              <DialogDescription>
                {t("nav.apiKeyDesc")}
              </DialogDescription>
            </DialogHeader>
            <Input
              type="password"
              placeholder="clé optionnelle…"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() => setApiKey(apiKeyInput || null)}>
                {t("nav.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mx-3" />

      <div className="p-3">
        <UserProfile collapsed={collapsed} />
      </div>
    </div>
  );
}
