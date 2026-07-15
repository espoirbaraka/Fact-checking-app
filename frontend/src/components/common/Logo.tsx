"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_NAME } from "@/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "h-6 w-6", text: "text-base" },
  md: { icon: "h-8 w-8", text: "text-xl" },
  lg: { icon: "h-12 w-12", text: "text-2xl" },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1a5f4a] to-[#2d8f6f]",
          sizes.icon
        )}
      >
        <ShieldCheck className="h-1/2 w-1/2 text-white" />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-[#1a5f4a] to-[#2d8f6f] bg-clip-text text-transparent",
            sizes.text
          )}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
