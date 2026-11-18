import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white",
        "transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
      {...props}
    />
  );
}
