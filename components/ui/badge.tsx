import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors', {
  variants: {
    variant: {
      default: 'border-white/10 bg-white/10 text-white',
      critical: 'border-red-400/30 bg-red-500/15 text-red-100',
      warning: 'border-yellow-400/30 bg-yellow-500/15 text-yellow-100',
      notice: 'border-blue-400/30 bg-blue-500/15 text-blue-100',
      passed: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
      brand: 'border-yellow-300/30 bg-yellow-300/15 text-yellow-100'
    }
  },
  defaultVariants: { variant: 'default' }
})

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
