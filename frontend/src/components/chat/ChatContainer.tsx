"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/common/Logo";
import { ChatInput, type ChatSendPayload } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { PluginSelector } from "@/components/chat/PluginSelector";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

export function ChatContainer() {
  const { user } = useAuthStore();
  const { messages, isLoading, isStreaming, sendMessage, regenerateMessage } =
    useChat();
  const { t } = useTranslation();

  const hasMessages = messages.length > 0;
  const userName = user?.name?.split(" ")[0] ?? "…";

  const handleSend = (payload: ChatSendPayload | string) => {
    void sendMessage(payload);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-center gap-3 border-b bg-card/50 px-4 py-3">
        <LanguageSelector />
        <PluginSelector />
      </div>

      {hasMessages ? (
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          onRegenerate={regenerateMessage}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex max-w-xl flex-col items-center text-center"
          >
            <Logo size="lg" stacked className="mb-6" />
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {t("chat.tagline")}
            </p>
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {t("chat.greeting", { name: userName })}
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              {t("chat.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mb-6 h-36 w-36 shrink-0 sm:h-44 sm:w-44"
          >
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 blur-xl" />
            <div className="relative flex h-full items-center justify-center">
              <div className="grid grid-cols-3 gap-3 opacity-30">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-7 w-7 rounded-lg sm:h-8 sm:w-8",
                      i % 3 === 0
                        ? "bg-primary/40"
                        : i % 3 === 1
                          ? "bg-emerald-400/40"
                          : "bg-teal-300/40"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="shrink-0 border-t bg-card/50 p-4 backdrop-blur-sm">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading || isStreaming}
          placeholder={t("chat.placeholder")}
        />
      </div>
    </div>
  );
}
