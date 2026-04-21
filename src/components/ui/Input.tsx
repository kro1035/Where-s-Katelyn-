import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
  suffix?: string
  helpText?: string
}

export function Input({ label, error, prefix, suffix, helpText, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-400 text-sm select-none">{prefix}</span>
        )}
        <input
          id={inputId}
          className={`
            w-full border rounded-lg text-sm text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-slate-50 disabled:text-slate-400
            ${error ? 'border-rose-400' : 'border-slate-300'}
            ${prefix ? 'pl-7' : 'pl-3'}
            ${suffix ? 'pr-10' : 'pr-3'}
            py-2
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-slate-400 text-sm select-none">{suffix}</span>
        )}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {helpText && !error && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
  )
}
