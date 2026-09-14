import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200',
      danger: 'bg-rose-50 text-rose-700 border border-rose-200',
      info: 'bg-blue-50 text-blue-700 border border-blue-200',
      neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'