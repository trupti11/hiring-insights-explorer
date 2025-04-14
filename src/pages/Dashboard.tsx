
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "@/components/ui/chart";
import { TimeToHireChart } from "@/components/charts/TimeToHireChart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface DepartmentData {
  department: string;
  avg_time_to_hire_days: number;
  num_hires: number;
}

const Dashboard = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeToHireData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("slowest_hiring_cycles")
          .select("department, avg_time_to_hire_days, num_hires")
          .order("department");

        if (error) {
          throw error;
        }

        if (data) {
          setDepartmentData(data);
        }
      } catch (error) {
        console.error("Error fetching time-to-hire data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeToHireData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hiring Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visualizing key hiring metrics and trends</p>
      </header>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Time-to-Hire Analysis</h2>
              <p className="text-sm text-muted-foreground">Average days to hire by department</p>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">View Details</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Time-to-Hire Details</SheetTitle>
                  <SheetDescription>
                    Detailed breakdown of hiring cycles by department
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Department</th>
                        <th className="text-right py-2">Avg. Days</th>
                        <th className="text-right py-2">Hires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept) => (
                        <tr key={dept.department} className="border-b">
                          <td className="py-2">{dept.department}</td>
                          <td className="text-right py-2">{dept.avg_time_to_hire_days.toFixed(1)}</td>
                          <td className="text-right py-2">{dept.num_hires}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p>Loading chart data...</p>
            </div>
          ) : error ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <ChartContainer
              className="h-[300px]"
              config={{
                blue: { theme: { light: "#3b82f6", dark: "#60a5fa" } },
              }}
            >
              <TimeToHireChart data={departmentData} />
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
