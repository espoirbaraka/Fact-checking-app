"use client";

import { AI_MODELS } from "@/constants";
import { useChatStore } from "@/store/chat.store";
import type { AIModel } from "@/types";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border">
      {AI_MODELS.map((model) => {
        const isSelected = selectedModel === model.id;

        return (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id as AIModel)}
            title={model.description}
            className={cn(
              "relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer",
              isSelected
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="model-selector"
                className="absolute inset-0 bg-primary rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{model.label}</span>
          </button>
        );
      })}
    </div>
  );
}
