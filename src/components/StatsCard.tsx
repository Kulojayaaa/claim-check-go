
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IndianRupee } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isCurrency?: boolean;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  className,
  color,
  trend,
  isCurrency = false
}: StatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center">
          {isCurrency && <IndianRupee className="h-5 w-5 mr-1" />}
          {typeof value === 'number' && isCurrency 
            ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)
            : value
          }
        </div>
        {(description || trend) && (
          <div className="flex items-center">
            {trend && (
              <span 
                className={cn(
                  "text-xs font-medium mr-2",
                  trend.isPositive ? "text-status-success" : "text-status-error"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
