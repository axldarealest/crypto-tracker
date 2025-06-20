"use client";

import { ToggleProps } from "@/types";

export default function Toggle({ label, defaultChecked = false, onChange }: ToggleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white/10 p-3 border border-dashed border-[var(--foreground)]/20">
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          defaultChecked={defaultChecked}
          onChange={handleChange}
        />
        <div className="relative w-11 h-6 bg-[var(--foreground)]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--foreground)]/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
      </label>
    </div>
  );
} 