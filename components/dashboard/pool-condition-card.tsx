import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PoolConditionCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  status: string;
  statusColor: string;
  children?: React.ReactNode;
}

export function PoolConditionCard({
  title,
  icon,
  value,
  status,
  statusColor,
  children
}: PoolConditionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </CardTitle>
          <Badge variant="outline" className={cn("font-normal", statusColor)}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}