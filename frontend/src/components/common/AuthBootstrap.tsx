"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth.service";
import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { setAuth, setBootstrapping, logout, isBootstrapping } = useAuthStore();
  const { setSessions } = useChatStore();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setBootstrapping(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      if (!token) {
        if (!cancelled) setBootstrapping(false);
        return;
      }

      try {
        const user = await authService.getProfile();
        if (cancelled) return;
        setAuth(user, token);

        try {
          const sessions = await chatService.getSessions();
          if (!cancelled) {
            setSessions(
              sessions.map((s) => ({
                id: s.id,
                title: s.title,
                updatedAt: s.updatedAt,
              }))
            );
          }
        } catch {
          if (!cancelled) setSessions([]);
        }
      } catch {
        if (!cancelled) logout();
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setAuth, setBootstrapping, logout, setSessions]);

  if (isBootstrapping) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3 px-6">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Restauration de la session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
