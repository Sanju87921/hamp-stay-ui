"use client";

import { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full mb-6">
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              "peer w-full h-14 bg-white/50 backdrop-blur-sm border-2 border-white/40 rounded-xl px-4 pt-4 pb-1 text-stone-900 placeholder-transparent outline-none transition-all duration-300 focus:border-terracotta-500 focus:bg-white/80 shadow-sm hover:border-white/60",
              error && "border-red-500 focus:border-red-500",
              isPassword && "pr-12",
              className
            )}
            placeholder={label}
            ref={ref}
            {...props}
          />
          <label
            className={cn(
              "absolute left-4 top-2 text-xs font-bold text-stone-500 uppercase tracking-widest transition-all duration-300 pointer-events-none",
              "peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal",
              "peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-terracotta-600",
              error && "text-red-500 peer-focus:text-red-500"
            )}
          >
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="absolute -bottom-5 left-1 text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
