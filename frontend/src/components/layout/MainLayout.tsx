"use client";

import { SidebarContent } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useChatStore } from "@/store/chat.store";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useChatStore();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside
          className={cn(
            "flex flex-col border-r bg-card transition-all duration-300 shrink-0",
            sidebarOpen ? "w-[var(--sidebar-width)]" : "w-[72px]"
          )}
        >
          <SidebarContent collapsed={!sidebarOpen} />
        </aside>
      )}

      {/* Mobile sidebar sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[var(--sidebar-width)]">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
