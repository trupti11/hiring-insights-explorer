
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer } from "@/components/ui/chart";
import { TimeToHireChart } from "@/components/charts/TimeToHireChart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { KpiCard } from "@/components/ui/kpi-card";
import { ThumbsDown, MessageSquare, ClipboardList, Star } from "lucide-react";

interface DepartmentData {
  department: string;
  avg_time_to_hire_days: number;
  num_hires: number;
}

interface OnboardingSurveyData {
  topic: string;
  department_count: number;
  negative_mentions: number;
}

const Dashboard = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [onboardingData, setOnboardingData] = useState<OnboardingSurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch time-to-hire data
        const timeToHireResponse = await supabase
          .from('slowest_hiring_cycles')
          .select('department, avg_time_to_hire_days, num_hires');

        // Fetch onboarding survey data
        const onboardingResponse = await supabase
          .from('onboarding_survey_kg')
          .select('topic, department_count, negative_mentions');

        if (timeToHireResponse.error) throw timeToHireResponse.error;
        if (onboardingResponse.error) throw onboardingResponse.error;

        if (timeToHireResponse.data) {
          setDepartmentData(timeToHireResponse.data as DepartmentData[]);
        }
        
        if (onboardingResponse.data) {
          setOnboardingData(onboardingResponse.data as OnboardingSurveyData[]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate summary metrics for KPI cards
  const totalNegativeMentions = onboardingData.reduce((sum, item) => 
    sum + (item.negative_mentions || 0), 0);
  
  const totalDepartments = [...new Set(onboardingData.map(item => item.department_count))].length;
  
  const mostCommonTopic = onboardingData.length > 0 
    ? onboardingData.reduce((prev, current) => 
        (current.negative_mentions || 0) > (prev.negative_mentions || 0) ? current : prev
      ).topic 
    : "N/A";

  const topIssueCount = onboardingData.length > 0 
    ? onboardingData.reduce((prev, current) => 
        Math.max(prev, current.negative_mentions || 0), 0)
    : 0;

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hiring Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visualizing key hiring metrics and trends</p>
      </header>

      <div className="grid gap-6">
        {/* Onboarding Survey KPI Cards */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Onboarding Survey Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              title="Total Negative Mentions" 
              value={loading ? "Loading..." : totalNegativeMentions}
              description="Issues reported during onboarding"
              colorScheme="red" 
              icon={<ThumbsDown size={20} />}
            />
            <KpiCard 
              title="Departments with Issues" 
              value={loading ? "Loading..." : totalDepartments}
              description="Departments requiring attention"
              colorScheme="blue"
              icon={<ClipboardList size={20} />} 
            />
            <KpiCard 
              title="Top Issue" 
              value={loading ? "Loading..." : mostCommonTopic}
              description={`${topIssueCount} mentions`}
              colorScheme="purple"
              icon={<Star size={20} />} 
            />
            <KpiCard 
              title="Survey Responses" 
              value={loading ? "Loading..." : onboardingData.length}
              description="Total feedback submissions"
              colorScheme="green"
              icon={<MessageSquare size={20} />}
            />
          </div>
        </div>

        {/* Time-to-Hire Analysis */}
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
