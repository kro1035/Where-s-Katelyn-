import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean
}

export function Card({ className = '', padding = true, children, ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${padding ? 'p-6' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}
