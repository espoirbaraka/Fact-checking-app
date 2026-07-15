"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import type { ChatMessage as ChatMessageType } from "@/types";

interface MessageListProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  onRegenerate: (messageId: string) => void;
}

export function MessageList({
  messages,
  isStreaming,
  onRegenerate,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onRegenerate={onRegenerate}
          />
        ))}
        {isStreaming &&
          messages.length > 0 &&
          messages[messages.length - 1].content === "" && (
            <TypingIndicator />
          )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
