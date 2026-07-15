"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth.service";
import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { setAuth, setBootstrapping, isBootstrapping, isAuthenticated } =
    useAuthStore();
  const { setSessions } = useChatStore();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setBootstrapping(true);
      try {
        const { user, token } = await authService.ensureSession();
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
          // conversations optional at boot
        }
      } catch (error) {
        console.error("Auth bootstrap failed", error);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setAuth, setBootstrapping, setSessions]);

  if (isBootstrapping && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3 px-6">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Connexion à Vérif Nord-Kivu…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
