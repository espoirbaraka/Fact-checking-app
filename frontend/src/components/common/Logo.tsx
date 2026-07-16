"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { APP_NAME } from "@/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { image: 28, className: "h-7 w-7" },
  md: { image: 36, className: "h-9 w-9" },
  lg: { image: 72, className: "h-[72px] w-[72px]" },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo-nord-kivu.png"
        alt={APP_NAME}
        width={sizes.image}
        height={sizes.image}
        className={cn("rounded-full object-contain shrink-0", sizes.className)}
        priority={size === "lg"}
      />
      {showText && (
        <span className="font-semibold tracking-wide text-foreground">
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
