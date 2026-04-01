import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: Readonly<CardProps>) {
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
