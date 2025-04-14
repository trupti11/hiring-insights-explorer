
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
  colorScheme?: "default" | "blue" | "green" | "red" | "purple";
}

export function KpiCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  colorScheme = "default",
}: KpiCardProps) {
  // Color mapping based on colorScheme
  const colorMap = {
    default: {
      background: "bg-card",
      border: "border",
      title: "text-muted-foreground",
      value: "text-foreground",
    },
    blue: {
      background: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-100 dark:border-blue-900",
      title: "text-blue-600 dark:text-blue-400",
      value: "text-blue-700 dark:text-blue-300",
    },
    green: {
      background: "bg-green-50 dark:bg-green-950/30", 
      border: "border-green-100 dark:border-green-900",
      title: "text-green-600 dark:text-green-400",
      value: "text-green-700 dark:text-green-300",
    },
    red: {
      background: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-100 dark:border-red-900",
      title: "text-red-600 dark:text-red-400",
      value: "text-red-700 dark:text-red-300",
    },
    purple: {
      background: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-100 dark:border-purple-900", 
      title: "text-purple-600 dark:text-purple-400",
      value: "text-purple-700 dark:text-purple-300",
    },
  };

  const colors = colorMap[colorScheme];

  return (
    <Card 
      className={cn(
        "overflow-hidden", 
        colors.background, 
        colors.border, 
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className={cn("text-sm font-medium", colors.title)}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className={cn("text-2xl font-bold", colors.value)}>
              {value}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="mt-2">
            <span className={cn(
              "text-xs font-medium",
              trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground"
            )}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs previous</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
