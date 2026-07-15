"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Check, Copy, RefreshCw, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SourcesPanel } from "@/components/chat/SourcesPanel";
import { Logo } from "@/components/common/Logo";
import type { ChatMessage as ChatMessageType } from "@/types";
import { cn } from "@/utils/cn";

interface ChatMessageProps {
  message: ChatMessageType;
  onRegenerate?: (messageId: string) => void;
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Logo size="sm" showText={false} />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 min-w-0 max-w-[85%]",
          isUser && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border shadow-sm"
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="prose-chat text-sm">
              {message.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");

                      if (match) {
                        return (
                          <SyntaxHighlighter
                            style={
                              theme === "dark" ? oneDark : oneLight
                            }
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: "0.5rem",
                              fontSize: "0.8125rem",
                            }}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        );
                      }

                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : message.isStreaming ? null : (
                <span className="text-muted-foreground">No response</span>
              )}
              {message.isStreaming && message.content && (
                <span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Fact check panel */}
        {!isUser && message.factCheck && !message.isStreaming && (
          <SourcesPanel factCheck={message.factCheck} />
        )}

        {/* Actions */}
        {!isUser && message.content && !message.isStreaming && (
          <div className="flex items-center gap-1 mt-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              className="h-7 w-7 text-muted-foreground"
              aria-label="Copier le message"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onRegenerate(message.id)}
                className="h-7 w-7 text-muted-foreground"
                aria-label="Régénérer la réponse"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
