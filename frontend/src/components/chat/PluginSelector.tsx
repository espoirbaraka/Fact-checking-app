"use client";

import { PLUGINS } from "@/constants";
import { useChatStore } from "@/store/chat.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Languages,
  Scale,
  Search,
  ShieldCheck,
  Puzzle,
} from "lucide-react";

const pluginIcons: Record<string, React.ComponentType<{ className?: string }>> =
  {
    "shield-check": ShieldCheck,
    search: Search,
    scale: Scale,
    languages: Languages,
  };

export function PluginSelector() {
  const { selectedPlugin, setSelectedPlugin } = useChatStore();

  return (
    <Select
      value={selectedPlugin ?? undefined}
      onValueChange={(value) => setSelectedPlugin(value)}
    >
      <SelectTrigger className="w-[180px] h-9 rounded-xl border-muted bg-muted/50 text-xs">
        <div className="flex items-center gap-2">
          <Puzzle className="h-3.5 w-3.5 text-primary" />
          <SelectValue placeholder="Outil" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {PLUGINS.map((plugin) => {
          const Icon = pluginIcons[plugin.icon] ?? Puzzle;
          return (
            <SelectItem key={plugin.id} value={plugin.id}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <div>
                  <span className="text-sm">{plugin.name}</span>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
