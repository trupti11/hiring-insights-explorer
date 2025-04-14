
import * as React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

interface TimeToHireChartProps {
  data: {
    department: string;
    avg_time_to_hire_days: number;
    num_hires: number;
  }[];
}

export function TimeToHireChart({ data }: TimeToHireChartProps) {
  // Sort data by department name for consistent display
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => a.department.localeCompare(b.department));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={sortedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="department"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{ 
            value: "Average Days", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: 'middle' }
          }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          name="Avg Time to Hire (Days)"
          type="monotone"
          dataKey="avg_time_to_hire_days"
          stroke="var(--color-blue)"
          activeDot={{ r: 8 }}
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <ChartTooltipContent>
      <p className="font-medium">{label}</p>
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Time to Hire:</span>
          <span className="font-medium">{data.avg_time_to_hire_days.toFixed(1)} days</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Number of Hires:</span>
          <span className="font-medium">{data.num_hires}</span>
        </div>
      </div>
    </ChartTooltipContent>
  );
}
