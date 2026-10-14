import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, id, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        <input
          id={id}
          type={type}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={describedBy}
          className={cn(
            'flex h-10 w-full rounded-lg border border-white/15 bg-[#161614] px-3 py-2 text-sm text-[#f1efe8] placeholder:text-[#f1efe8]/40 focus:outline-none focus:ring-2 focus:ring-[#d8763d]/40 focus:border-[#d8763d] disabled:cursor-not-allowed disabled:opacity-40 transition-colors',
            error && 'border-red-500/60 focus:ring-red-500/40 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
