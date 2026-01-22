"use client";

import { Calendar } from "lucide-react";

export default function SpinnerLoader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
 
      <div className="relative flex items-center justify-center h-48 w-48">
        
   
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/30 animate-spin transition-all duration-700"></div>
        
     
        <div className="absolute inset-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-inner"></div>


        <div className="relative h-36 w-36 rounded-full bg-white dark:bg-slate-900 shadow-xl flex flex-col items-center justify-center border border-slate-50 dark:border-slate-800">
          
      
          <div className="relative mb-1">
            <Calendar className="h-10 w-10 text-primary animate-pulse" strokeWidth={1.5} />
            
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>

       
          <div className="text-center px-3">
            <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1">
              Events
            </span>
           
            <div className="flex gap-1 justify-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        </div>

    
        <div className="absolute -z-10 h-full w-full bg-primary/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}