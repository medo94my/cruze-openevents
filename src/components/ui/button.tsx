'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[#d8763d] text-white hover:bg-[#c4652e] focus-visible:ring-[#d8763d]',
        destructive: 'border border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/25 focus-visible:ring-red-500',
        outline: 'border border-white/20 bg-transparent text-[#f1efe8] hover:bg-white/10 hover:border-white/40 focus-visible:ring-white/40',
        secondary: 'border border-white/10 bg-white/5 text-[#f1efe8] hover:bg-white/10 focus-visible:ring-white/20',
        cancel: 'border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 focus-visible:ring-amber-400',
        ghost: 'text-[#f1efe8]/80 hover:bg-white/10 hover:text-[#f1efe8] focus-visible:ring-white/20',
        link: 'text-[#d8763d] underline-offset-4 hover:underline focus-visible:ring-[#d8763d]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-[11px]',
        lg: 'h-11 rounded-lg px-8 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
