"use client";

import { ClipLoader } from "react-spinners";
import { Activity } from "lucide-react";

interface LoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
  showIcon?: boolean;
}

const SIZE_MAP = {
  sm: 20,
  md: 35,
  lg: 50,
  xl: 70,
} as const;

export default function SpinnerLoader({
  text = "Next Level healthcare...",
  size = "md",
  className = "",
  animated = true,
  showIcon = false,
}: LoaderProps) {
  const spinnerSize = SIZE_MAP[size];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 min-h-screen ${className}`}
    >
      {/* Spinner */}
      <ClipLoader
        size={spinnerSize}
        color="#3B82F6"
        speedMultiplier={animated ? 1 : 0}
      />

      {/* Optional icon instead of spinner */}
      {showIcon && (
        <Activity className="text-blue-500" size={spinnerSize - 10} />
      )}

      {/* Text */}
      {text && (
        <p className="font-medium text-gray-600 text-center text-[16px]">
          {text}
        </p>
      )}
    </div>
  );
}
