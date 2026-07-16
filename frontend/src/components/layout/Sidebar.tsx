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
  } = useChatStore();
  const { apiKey, setApiKey } = useSettingsStore();
  const [apiKeyInput, setApiKeyInput] = useState(apiKey ?? "");
  const [searchOpen, setSearchOpen] = useState(false);
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

  const aboutActive = pathname.startsWith("/about");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-4 pb-2">
        <Logo size={collapsed ? "sm" : "md"} showText={!collapsed} />
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
          {!collapsed && "Nouvelle vérification"}
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
          {!collapsed && "Rechercher"}
        </Button>

        {(searchOpen || sessionSearch) && !collapsed && (
          <div className="relative pt-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              placeholder="Filtrer mes vérifications…"
              className="pl-9 pr-8 h-9 rounded-xl bg-muted/50 border-0"
              aria-label="Rechercher une vérification"
            />
            {sessionSearch && (
              <button
                type="button"
                onClick={() => {
                  setSessionSearch("");
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Effacer la recherche"
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
            {!collapsed && "À propos"}
          </Link>
        </nav>

        {!collapsed && (
          <>
            <div className="mt-4 mb-2 px-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Mes vérifications
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
                  Aucune vérification récente
                </p>
              )}
              {sessions.length > 0 && filteredSessions.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  Aucun résultat pour « {sessionSearch} »
                </p>
              )}
              {filteredSessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => handleOpenSession(session.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors text-left",
                    activeSessionId === session.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <span className="truncate">{session.title}</span>
                </button>
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
                <span className="font-semibold text-sm">Contexte local</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Croisez toujours avec radio communautaire, ONG et témoins avant
                de diffuser une info.
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
              {!collapsed && "Clé API (optionnel)"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clé API</DialogTitle>
              <DialogDescription>
                Optionnel : pour des services externes. L&apos;IA locale
                (Ollama) fonctionne sans clé.
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
                Enregistrer
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
