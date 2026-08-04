"use client";

import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: string;
}

export default function GlassCard({
  children,
  className = "",
  title,
  icon,
}: GlassCardProps) {
  return (
    <div className={`glass p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-2.5 mb-5">
          {icon && (
            <span className="material-symbols-outlined text-accent-blue text-[22px]">
              {icon}
            </span>
          )}
          <h2 className="text-[17px] font-semibold text-[#1c1c1e] tracking-tight">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}
