"use client";


import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface ClearFiltersButtonProps {

  preserveParams?: string[];
  excludeFromCount?: string[];
  onBeforeClear?: () => boolean | void;

  onAfterClear?: () => void;

  variant?: "ghost" | "outline" | "destructive" | "secondary";

  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  showCount?: boolean;
}

const ClearFiltersButton = ({
  preserveParams = [],
  excludeFromCount = ["page", "limit", "sortBy", "sortOrder"],
  onBeforeClear,
  onAfterClear,
  variant = "ghost",
  size = "default",
  className = "h-10 px-3",
  label = "Clear",
  showCount = true,
}: ClearFiltersButtonProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFiltersCount = Array.from(searchParams.keys()).filter(
    (key) => !preserveParams.includes(key) && !excludeFromCount.includes(key)
  ).length;

  const handleClear = () => {
    if (onBeforeClear) {
      const shouldProceed = onBeforeClear();
      if (shouldProceed === false) return;
    }

    const params = new URLSearchParams();

    preserveParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });

    startTransition(() => {
      if (params.toString()) {
        router.push(`?${params.toString()}`);
      } else {
        router.push(window.location.pathname);
      }
    });


    onAfterClear?.();
  };


  if (activeFiltersCount === 0) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClear}
      disabled={isPending}
      className={className}
    >
      <X className="h-4 w-4 mr-1" />
      {label}
      {showCount && ` (${activeFiltersCount})`}
    </Button>
  );
};

export default ClearFiltersButton;
