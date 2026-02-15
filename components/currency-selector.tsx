"use client";

import { useState } from 'react';
import { currencies, CurrencyCode } from '@/lib/currency/config';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = currencies[value];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg text-white text-sm hover:bg-zinc-700 transition-colors border border-white/10"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="font-medium">{value}</span>
        <span className="text-zinc-500 text-xs">{selected.symbol}</span>
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-72 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs font-medium text-zinc-500 uppercase px-3 py-2">Select Currency</p>
              {Object.entries(currencies).map(([code, config]) => (
                <button
                  key={code}
                  onClick={() => {
                    onChange(code as CurrencyCode);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-white/5 transition-colors rounded-lg",
                    code === value && "bg-emerald-500/10"
                  )}
                >
                  <span className="text-2xl">{config.flag}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{code}</p>
                    <p className="text-xs text-zinc-500">{config.name}</p>
                  </div>
                  <span className="text-zinc-400 font-medium">{config.symbol}</span>
                  {code === value && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}