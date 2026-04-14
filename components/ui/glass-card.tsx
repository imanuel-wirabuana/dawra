"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { cardHover } from "@/lib/animations";

type BlurLevel = "sm" | "md" | "lg" | "xl" | "2xl";
type BorderLevel = "none" | "subtle" | "gradient";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "className"> {
  children: React.ReactNode;
  className?: string;
  blur?: BlurLevel;
  border?: BorderLevel;
  hover?: boolean;
  active?: boolean;
  intensity?: "low" | "medium" | "high";
}

const blurClasses: Record<BlurLevel, string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
};

const intensityClasses = {
  low: "bg-white/5 dark:bg-black/5",
  medium: "bg-white/10 dark:bg-black/10",
  high: "bg-white/20 dark:bg-black/20",
};

export function GlassCard({
  children,
  className,
  blur = "md",
  border = "subtle",
  hover = true,
  active = false,
  intensity = "medium",
  ...props
}: GlassCardProps) {
  const borderClasses = {
    none: "",
    subtle: "border border-white/20 dark:border-white/10",
    gradient:
      "border border-transparent bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5",
  };

  const baseClasses = cn(
    "relative rounded-xl overflow-hidden",
    blurClasses[blur],
    intensityClasses[intensity],
    borderClasses[border],
    "shadow-lg shadow-black/5 dark:shadow-black/10",
    active && "ring-2 ring-primary/50",
    className
  );

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={cardHover}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={baseClasses} {...props}>
      {children}
    </motion.div>
  );
}

// Specialized variants for common use cases
export function GlassPanel({
  children,
  className,
  ...props
}: Omit<GlassCardProps, "blur" | "intensity">) {
  return (
    <GlassCard
      blur="lg"
      intensity="medium"
      border="subtle"
      hover={false}
      className={cn("p-6", className)}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

export function GlassHeader({
  children,
  className,
  scrolled = false,
  ...props
}: Omit<GlassCardProps, "blur" | "intensity"> & { scrolled?: boolean }) {
  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-white/80 dark:bg-black/80 shadow-sm"
          : "bg-transparent",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.header>
  );
}

export function GlassModal({
  children,
  className,
  ...props
}: Omit<GlassCardProps, "blur" | "intensity" | "border">) {
  return (
    <GlassCard
      blur="xl"
      intensity="high"
      border="gradient"
      hover={false}
      className={cn("p-6 max-w-lg w-full mx-4", className)}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

export function GlassButton({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<GlassCardProps, "blur" | "intensity" | "border"> & {
  variant?: "default" | "primary" | "ghost" | "danger";
  size?: "sm" | "default" | "lg" | "icon";
}) {
  const variantClasses = {
    default: "bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10",
    primary: "bg-primary/20 hover:bg-primary/30 text-primary-foreground",
    ghost: "bg-transparent hover:bg-white/10 dark:hover:bg-white/5",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10 p-0 flex items-center justify-center",
  };

  return (
    <GlassCard
      blur="sm"
      intensity="low"
      border="subtle"
      hover={true}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

// Skeleton loading card with shimmer effect
export function GlassSkeleton({
  className,
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <GlassCard
      blur="md"
      intensity="low"
      border="subtle"
      hover={false}
      className={cn("p-4 space-y-3", className)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-white/10 dark:bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-1/4 bg-white/10 dark:bg-white/5 rounded animate-pulse" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 w-full bg-white/10 dark:bg-white/5 rounded animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </GlassCard>
  );
}
