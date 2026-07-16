"use client";

import { useCallback } from "react";
import { useChatStore } from "@/store/chat.store";
import { chatService, streamText } from "@/services/chat.service";
import type { ChatSendPayload } from "@/components/chat/ChatInput";
import type { ChatMessage } from "@/types";

export function useChat() {
  const {
    messages,
    selectedModel,
    selectedPlugin,
    isLoading,
    isStreaming,
    addMessage,
    updateMessage,
    appendToMessage,
    setIsLoading,
    setIsStreaming,
    activeSessionId,
    setActiveSession,
    sessions,
    setSessions,
  } = useChatStore();

  const sendMessage = useCallback(
    async (payload: string | ChatSendPayload) => {
      const normalized: ChatSendPayload =
        typeof payload === "string"
          ? { message: payload }
          : payload;

      const content = normalized.message.trim();
      const file = normalized.files?.[0];
      if ((!content && !file) || isLoading || isStreaming) return;

      const displayContent =
        content ||
        (file ? `📎 ${file.name} (analyse OCR)` : "");

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: "user",
        content: displayContent,
        createdAt: new Date().toISOString(),
      };

      addMessage(userMessage);
      setIsLoading(true);

      const assistantId = `msg-${Date.now()}-assistant`;
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };

      addMessage(assistantMessage);
      setIsLoading(false);
      setIsStreaming(true);

      try {
        const response = await chatService.sendMessage({
          sessionId: activeSessionId,
          content,
          model: selectedModel,
          plugin: selectedPlugin ?? undefined,
          file,
        });

        if (response.conversationId && response.conversationId !== activeSessionId) {
          setActiveSession(response.conversationId);
          setSessions([
            {
              id: response.conversationId,
              title:
                displayContent.length > 60
                  ? `${displayContent.slice(0, 57)}...`
                  : displayContent,
              updatedAt: new Date().toISOString(),
            },
            ...sessions.filter((s) => s.id !== response.conversationId),
          ]);
        }

        for await (const chunk of streamText(response.content)) {
          appendToMessage(assistantId, chunk);
        }

        updateMessage(assistantId, {
          id: response.id,
          isStreaming: false,
          factCheck: response.factCheck,
        });
      } catch (error) {
        const message =
          error instanceof Error && "response" in error
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((error as any).response?.data?.message as string | undefined)
            : undefined;

        updateMessage(assistantId, {
          content:
            message ||
            "Impossible d'obtenir une réponse. Vérifiez le fichier (PDF/image) et que le backend / l'IA tournent.",
          isStreaming: false,
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [
      isLoading,
      isStreaming,
      addMessage,
      updateMessage,
      appendToMessage,
      setIsLoading,
      setIsStreaming,
      activeSessionId,
      selectedModel,
      selectedPlugin,
      setActiveSession,
      sessions,
      setSessions,
    ]
  );

  const regenerateMessage = useCallback(
    async (messageId: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex <= 0) return;

      const userMessage = messages[messageIndex - 1];
      if (userMessage.role !== "user") return;

      const filteredMessages = messages.filter((m) => m.id !== messageId);
      useChatStore.setState({ messages: filteredMessages });
      await sendMessage(userMessage.content);
    },
    [messages, sendMessage]
  );

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    regenerateMessage,
  };
}
