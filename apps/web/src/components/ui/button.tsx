import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const isSecondary = className?.includes("bg-white") || className?.includes("text-neutral-900");
  const isDanger = className?.includes("text-red");
  const variantClass = isDanger
    ? "border border-red-200 bg-white text-red-700 hover:bg-red-50"
    : isSecondary
      ? "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
      : "bg-neutral-900 text-white hover:bg-neutral-700";

  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantClass,
        className
      )}
      {...props}
    />
  );
}
