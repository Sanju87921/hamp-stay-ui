import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-navy-950 text-white hover:bg-gold-500 shadow-luxury hover:shadow-gold",
      secondary: "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-luxury hover:shadow-gold",
      outline: "border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white",
      ghost: "text-navy-950 hover:bg-sand-100 hover:text-navy-800",
    };

    const sizes = {
      sm: "h-10 px-5 text-sm font-semibold",
      md: "h-12 px-7 text-base font-semibold",
      lg: "h-14 px-9 text-lg font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-500 ease-[0.16,1,0.3,1] focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-sand-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
