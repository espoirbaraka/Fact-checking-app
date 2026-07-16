"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Newspaper } from "lucide-react";
import api, { unwrapData } from "@/services/api";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

export type NewsItem = {
  title: string;
  url: string;
  snippet?: string;
  domain?: string;
};

export function NordKivuNewsStrip({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await api.get("/ai/news/nord-kivu");
        const data = unwrapData<{ items: NewsItem[] }>(response);
        if (!cancelled) {
          setItems(Array.isArray(data?.items) ? data.items : []);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full max-w-5xl mx-auto mt-2", className)}>
      <div className="flex items-center gap-2 px-1 mb-2">
        <Newspaper className="h-4 w-4 text-primary shrink-0" />
        <h2 className="text-sm font-semibold text-foreground">
          {t("news.title")}
        </h2>
        <span className="text-[11px] text-muted-foreground">
          {t("news.subtitle")}
        </span>
      </div>

      <div
        className="flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden pb-2 px-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="shrink-0 w-[260px] h-[108px] rounded-xl border bg-muted/40 animate-pulse"
            />
          ))}

        {!loading &&
          items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "shrink-0 w-[260px] snap-start rounded-xl border bg-card p-3",
                "hover:border-primary/30 hover:bg-accent/40 transition-colors group",
                "flex flex-col gap-1.5 h-[108px]"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wide text-primary font-medium truncate">
                  {item.domain || t("news.source")}
                </span>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-sm font-medium leading-snug line-clamp-2">
                {item.title}
              </p>
              {item.snippet ? (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>
              ) : null}
            </a>
          ))}
      </div>
    </section>
  );
}
