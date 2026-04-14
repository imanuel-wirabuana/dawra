"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations"
import { useInViewAnimation } from "@/hooks/useInViewAnimation"

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  className?: string
  size?: "sm" | "md" | "lg"
  align?: "left" | "center"
  variant?: "default" | "glass" | "gradient"
}

const sizeClasses = {
  sm: {
    title: "text-2xl",
    subtitle: "text-sm",
    icon: "w-8 h-8",
    container: "py-4",
  },
  md: {
    title: "text-3xl md:text-4xl",
    subtitle: "text-base",
    icon: "w-10 h-10",
    container: "py-6 md:py-8",
  },
  lg: {
    title: "text-4xl md:text-5xl lg:text-6xl",
    subtitle: "text-lg",
    icon: "w-12 h-12",
    container: "py-8 md:py-12",
  },
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  breadcrumbs,
  className,
  size = "md",
  align = "left",
  variant = "default",
}: PageHeaderProps) {
  const { ref, isInView } = useInViewAnimation({ threshold: 0.1 })
  const sizes = sizeClasses[size]

  const variantClasses = {
    default: "",
    glass: "bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-2xl px-6",
    gradient:
      "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl px-6",
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "relative",
        sizes.container,
        variantClasses[variant],
        className
      )}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.nav
          variants={staggerItem}
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground mb-4",
            align === "center" && "justify-center"
          )}
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted-foreground/40">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className={cn(index === breadcrumbs.length - 1 && "text-foreground")}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </motion.nav>
      )}

      <div
        className={cn(
          "flex flex-col gap-1",
          align === "center" && "items-center text-center",
          actions && "sm:flex-row sm:items-end sm:justify-between sm:gap-4"
        )}
      >
        <div className={cn("space-y-2", align === "center" && "flex flex-col items-center")}>
          {/* Icon + Title */}
          <motion.div
            variants={fadeInUp}
            className={cn(
              "flex items-center gap-3",
              align === "center" && "flex-col"
            )}
          >
            {Icon && (
              <motion.div
                className={cn(
                  "flex items-center justify-center rounded-xl bg-primary/10 text-primary",
                  sizes.icon
                )}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Icon className="w-1/2 h-1/2" />
              </motion.div>
            )}
            <h1
              className={cn(
                "font-bold tracking-tight",
                sizes.title
              )}
            >
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              variants={staggerItem}
              className={cn(
                "text-muted-foreground max-w-2xl",
                sizes.subtitle,
                align === "center" && "mx-auto"
              )}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <motion.div
            variants={staggerItem}
            className="flex items-center gap-2 mt-4 sm:mt-0"
          >
            {actions}
          </motion.div>
        )}
      </div>

      {/* Decorative elements */}
      {variant === "gradient" && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
        </div>
      )}
    </motion.div>
  )
}

// Compact version for use in cards or panels
export function PageHeaderCompact({
  title,
  subtitle,
  icon: Icon,
  action,
  className,
}: Omit<PageHeaderProps, "actions" | "breadcrumbs" | "size" | "align" | "variant"> & {
  action?: React.ReactNode
}) {
  const { ref, isInView } = useInViewAnimation({ threshold: 0.1 })

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("flex items-center justify-between", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

// Section header for subsections within pages
export function SectionHeader({
  title,
  description,
  icon: Icon,
  className,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}) {
  const { ref, isInView } = useInViewAnimation({ threshold: 0.1 })

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("space-y-1", className)}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground pl-6">{description}</p>
      )}
    </motion.div>
  )
}
