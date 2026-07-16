"use client";

import { useState, useCallback, useRef, type DragEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
];
const ACCEPTED_EXTENSIONS = /\.(pdf|png|jpe?g|webp|gif)$/i;

export type ChatSendPayload = {
  message: string;
  files?: File[];
};

interface ChatInputProps {
  onSend: (payload: ChatSendPayload) => void;
  isLoading?: boolean;
  placeholder?: string;
}

function isAllowedFile(file: File): boolean {
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  return ACCEPTED_EXTENSIONS.test(file.name);
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder,
}: ChatInputProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t("chat.placeholder");
  const [value, setValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea(value);

  const addFiles = useCallback((files: File[]) => {
    const valid = files.filter(isAllowedFile);
    const rejected = files.length - valid.length;
    if (rejected > 0) {
      setFileError(t("chat.fileFormats"));
    } else {
      setFileError(null);
    }
    if (valid.length === 0) return;
    setAttachedFiles((prev) => [...prev, ...valid].slice(0, 3));
  }, [t]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if ((!trimmed && attachedFiles.length === 0) || isLoading) return;
    onSend({
      message: trimmed,
      files: attachedFiles.length ? attachedFiles : undefined,
    });
    setValue("");
    setAttachedFiles([]);
    setFileError(null);
    adjustHeight();
  }, [value, attachedFiles, isLoading, onSend, adjustHeight]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSend = (value.trim().length > 0 || attachedFiles.length > 0) && !isLoading;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-1">
          {attachedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs"
            >
              <Paperclip className="h-3 w-3" />
              <span className="truncate max-w-[140px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Retirer le fichier"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {fileError && (
        <p className="text-xs text-destructive mb-2 px-1">{fileError}</p>
      )}

      <motion.div
        className={cn(
          "relative rounded-2xl border bg-card shadow-sm transition-all",
          isDragging && "border-primary ring-2 ring-primary/20"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-start gap-2 p-3">
          <Sparkles className="h-4 w-4 text-primary mt-2.5 ml-1 shrink-0" />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              attachedFiles.length
                ? t("chat.placeholderWithFile")
                : resolvedPlaceholder
            }
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none min-h-[40px] max-h-[200px] py-2"
          />
        </div>

        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,application/pdf,image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground gap-1.5 h-8 rounded-lg"
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">{t("chat.attach")}</span>
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground rounded-lg"
              disabled={isLoading}
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              size="icon-sm"
              className="rounded-lg h-8 w-8"
              aria-label={t("chat.send")}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
