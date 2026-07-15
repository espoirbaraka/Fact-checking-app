"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import type { FactCheckResult } from "@/types";
import { FactCheckBadge } from "@/components/chat/FactCheckBadge";
import { cn } from "@/utils/cn";

interface SourcesPanelProps {
  factCheck: FactCheckResult;
  className?: string;
}

export function SourcesPanel({ factCheck, className }: SourcesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "mt-3 rounded-xl border bg-muted/30 overflow-hidden",
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <FactCheckBadge
            status={factCheck.status}
            confidence={factCheck.confidence}
          />
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t">
              <p className="text-sm text-muted-foreground pt-3">
                {factCheck.summary}
              </p>

              {/* Evidence */}
              <div className="rounded-lg bg-background p-3 border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Preuves</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {factCheck.evidence}
                </p>
              </div>

              {/* Sources list */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sources ({factCheck.sources.length})
                </span>
                {factCheck.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg border bg-background p-3 hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {source.title}
                        </span>
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {source.snippet}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-medium text-primary">
                        {source.reliability}%
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        fiabilité
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
