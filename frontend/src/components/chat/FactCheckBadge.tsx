"use client";

import type { VerificationStatus } from "@/types";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { VERIFICATION_STATUS_CONFIG } from "@/constants";

interface FactCheckBadgeProps {
  status: VerificationStatus;
  confidence: number;
  className?: string;
}

const statusIcons = {
  verified: ShieldCheck,
  uncertain: ShieldAlert,
  false: ShieldX,
};

const badgeVariants = {
  verified: "success" as const,
  uncertain: "warning" as const,
  false: "danger" as const,
};

const statusLabelKey = {
  verified: "fact.yes",
  uncertain: "fact.uncertain",
  false: "fact.no",
} as const;

export function FactCheckBadge({
  status,
  confidence,
  className,
}: FactCheckBadgeProps) {
  const { t } = useTranslation();
  const config = VERIFICATION_STATUS_CONFIG[status];
  const Icon = statusIcons[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5",
        config.bg,
        config.border,
        className
      )}
    >
      <Icon className={cn("h-4 w-4", config.color)} />
      <Badge variant={badgeVariants[status]} className="text-xs">
        {t(statusLabelKey[status])}
      </Badge>
      <span className={cn("text-xs font-medium", config.color)}>
        {confidence}%
      </span>
    </div>
  );
}
