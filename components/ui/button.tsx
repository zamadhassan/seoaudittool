import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva('inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-bold transition disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      default: 'bg-nexora-yellow text-black shadow-lg shadow-yellow-500/15 hover:bg-yellow-300',
      outline: 'border border-white/15 bg-white/5 text-white hover:border-yellow-300/40 hover:bg-white/10',
      ghost: 'text-zinc-300 hover:bg-white/10 hover:text-white'
    },
    size: {
      default: 'h-11 px-5',
      lg: 'h-12 px-6',
      sm: 'h-9 px-3'
    }
  },
  defaultVariants: { variant: 'default', size: 'default' }
})

export function Button({ className, variant, size, asChild = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
