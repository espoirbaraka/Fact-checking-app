"use client";

import { useCallback, useEffect, useRef } from "react";

export function useAutoResizeTextarea(
  value: string,
  maxHeight = 200
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return { textareaRef, adjustHeight };
}
