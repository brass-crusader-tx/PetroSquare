import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function NumberInput({ value, onChange, min, max, step = 1, className, disabled }: NumberInputProps) {
  const handleIncrement = () => {
    if (disabled) return;
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange(Number(newValue.toFixed(10))); // Avoid floating point errors
  };

  const handleDecrement = () => {
    if (disabled) return;
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange(Number(newValue.toFixed(10))); // Avoid floating point errors
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
        onChange(0);
        return;
    }
    const newVal = parseFloat(val);
    if (!isNaN(newVal)) {
      onChange(newVal);
    }
  };

  return (
    <div className={`relative flex items-stretch bg-surface-highlight/30 border border-border/50 rounded-lg overflow-hidden focus-within:border-primary transition-colors ${className || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full bg-transparent text-white p-2 text-sm font-mono outline-none appearance-none m-0"
      />
      <div className="flex flex-col border-l border-border/50 bg-surface-highlight/10 w-6 shrink-0">
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
          className="flex-1 hover:bg-surface-highlight text-muted hover:text-white transition-colors flex items-center justify-center disabled:opacity-30 active:bg-surface-highlight/50"
        >
          <ChevronUp size={12} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && value <= min)}
          className="flex-1 hover:bg-surface-highlight text-muted hover:text-white transition-colors flex items-center justify-center border-t border-border/50 disabled:opacity-30 active:bg-surface-highlight/50"
        >
          <ChevronDown size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
