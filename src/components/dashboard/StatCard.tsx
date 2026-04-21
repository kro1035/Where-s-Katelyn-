import { Card } from '@/components/ui/Card'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  icon: React.ReactNode
  iconBg?: string
  valueColor?: string
}

export function StatCard({ label, value, subValue, icon, iconBg = 'bg-indigo-100', valueColor = 'text-slate-900' }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tabular-nums ${valueColor}`}>{value}</p>
        {subValue && <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>}
      </div>
    </Card>
  )
}
