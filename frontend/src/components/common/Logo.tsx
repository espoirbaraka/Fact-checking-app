"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { APP_NAME } from "@/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  /** Place the name under the emblem instead of beside it */
  stacked?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { image: 28, className: "h-7 w-7", text: "text-sm" },
  md: { image: 36, className: "h-9 w-9", text: "text-base" },
  lg: { image: 72, className: "h-[72px] w-[72px]", text: "text-xl" },
};

export function Logo({
  size = "md",
  showText = true,
  stacked = false,
  className,
}: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <div
      className={cn(
        "flex",
        stacked
          ? "flex-col items-center gap-2"
          : "flex-row items-center gap-2.5",
        className
      )}
    >
      <Image
        src="/logo-nord-kivu.png"
        alt={APP_NAME}
        width={sizes.image}
        height={sizes.image}
        className={cn("rounded-full object-contain shrink-0", sizes.className)}
        priority={size === "lg"}
      />
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-wide text-foreground",
            sizes.text
          )}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
