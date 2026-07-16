"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/common/Logo";
import { ChatInput, type ChatSendPayload } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { PluginSelector } from "@/components/chat/PluginSelector";
import { NordKivuNewsStrip } from "@/components/chat/NordKivuNewsStrip";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/store/auth.store";
import { QUICK_ACTIONS } from "@/constants";
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-3 px-4 py-3 border-b bg-card/50">
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
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center px-4 pt-6 pb-2 min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center mb-8 max-w-xl"
            >
              <Logo size="lg" className="justify-center mb-6" />
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("chat.tagline")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {t("chat.greeting", { name: userName })}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                {t("chat.subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-40 h-40 sm:w-52 sm:h-52 mb-4"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 blur-2xl" />
              <div className="relative flex items-center justify-center h-full">
                <div className="grid grid-cols-3 gap-3 opacity-30">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-8 w-8 rounded-lg",
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="w-full px-4 pb-4 shrink-0"
          >
            <NordKivuNewsStrip />
          </motion.div>
        </div>
      )}

      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading || isStreaming}
          placeholder={t("chat.placeholder")}
        />

        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mt-4 max-w-3xl mx-auto"
          >
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleSend(action)}
                className="rounded-full border bg-card px-4 py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer text-left max-w-sm"
              >
                {action}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
