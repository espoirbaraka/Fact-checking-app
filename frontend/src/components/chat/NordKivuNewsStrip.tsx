"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper } from "lucide-react";
import api, { unwrapData } from "@/services/api";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/utils/cn";

export type NewsItem = {
  title: string;
  url: string;
  snippet?: string;
  domain?: string;
};

const SCROLL_STEP = 280;

export function NordKivuNewsStrip({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  };

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

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [items, loading, updateScrollState]);

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-2 flex items-center gap-2 px-1">
        <Newspaper className="h-4 w-4 shrink-0 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          {t("news.title")}
        </h2>
        <span className="text-[11px] text-muted-foreground">
          {t("news.subtitle")}
        </span>
      </div>

      {!loading && items.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">{t("news.empty")}</p>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => scrollByDir(-1)}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-card shadow-sm",
              "hover:border-primary/30 hover:bg-accent transition-opacity",
              "disabled:pointer-events-none disabled:opacity-30 disabled:hover:bg-card"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex min-w-0 flex-1 flex-nowrap gap-3 overflow-x-auto overflow-y-hidden py-0.5 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="h-[108px] w-[260px] shrink-0 animate-pulse rounded-xl border bg-muted/40"
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
                    "group flex h-[108px] w-[260px] shrink-0 snap-start flex-col gap-1.5 rounded-xl border bg-card p-3",
                    "transition-colors hover:border-primary/30 hover:bg-accent/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-[10px] font-medium uppercase tracking-wide text-primary">
                      {item.domain || t("news.source")}
                    </span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="line-clamp-2 text-sm font-medium leading-snug">
                    {item.title}
                  </p>
                  {item.snippet ? (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {item.snippet}
                    </p>
                  ) : null}
                </a>
              ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            disabled={!canNext}
            onClick={() => scrollByDir(1)}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-card shadow-sm",
              "hover:border-primary/30 hover:bg-accent transition-opacity",
              "disabled:pointer-events-none disabled:opacity-30 disabled:hover:bg-card"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
