
import { cn } from "@/lib/utils";

type StatusType = 'open' | 'closed' | 'maintenance' | 'full' | 'limited';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfigs = {
  open: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'Open'
  },
  closed: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    label: 'Closed'
  },
  maintenance: {
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    label: 'Maintenance'
  },
  full: {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    label: 'Full'
  },
  limited: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    label: 'Limited'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfigs[status];
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
      config.bgColor,
      config.textColor,
      className
    )}>
      <span className={cn("mr-1 h-2 w-2 rounded-full", 
        status === 'open' ? 'bg-green-600' : 
        status === 'closed' ? 'bg-red-600' : 
        status === 'maintenance' ? 'bg-amber-600' : 
        status === 'full' ? 'bg-purple-600' : 
        'bg-blue-600'
      )} />
      {config.label}
    </span>
  );
}

export default StatusBadge;
