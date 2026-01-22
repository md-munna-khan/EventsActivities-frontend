"use client";

import { Calendar } from "lucide-react";

export default function CompactCircularLoader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      {/* Container size lowered from h-64 to h-48 */}
      <div className="relative flex items-center justify-center h-48 w-48">
        
        {/* Outer Rotating Border - Primary Color */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/30 animate-spin transition-all duration-700"></div>
        
        {/* Inner Static Ring */}
        <div className="absolute inset-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-inner"></div>

        {/* Middle Round Card - Size lowered from h-48 to h-36 */}
        <div className="relative h-36 w-36 rounded-full bg-white dark:bg-slate-900 shadow-xl flex flex-col items-center justify-center border border-slate-50 dark:border-slate-800">
          
          {/* Animated Icon - Primary Color */}
          <div className="relative mb-1">
            <Calendar className="h-10 w-10 text-primary animate-pulse" strokeWidth={1.5} />
            {/* Notification Dot */}
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>

          {/* Text Content */}
          <div className="text-center px-3">
            <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1">
              Events
            </span>
            {/* Jumping Dots - Primary Color */}
            <div className="flex gap-1 justify-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        </div>

        {/* Subtle Background Glow */}
        <div className="absolute -z-10 h-full w-full bg-primary/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}