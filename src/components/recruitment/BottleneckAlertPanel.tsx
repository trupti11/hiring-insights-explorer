
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StageDelay {
  current_stage: string;
  next_stage: string;
  avg_delay_days: number;
  max_delay_days: number;
  transition_count: number;
}

export function BottleneckAlertPanel() {
  const [stageDelays, setStageDelays] = useState<StageDelay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDelayData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('recruitment_stage_delays')
          .select('*')
          .order('avg_delay_days', { ascending: false });
          
        if (error) throw error;
        
        setStageDelays(data as StageDelay[]);
      } catch (error) {
        console.error("Error fetching recruitment stage delays:", error);
        setError("Failed to load recruitment stage delay data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDelayData();
  }, []);

  // Find the most severe bottleneck (highest average delay)
  const criticalBottleneck = stageDelays.length > 0 ? stageDelays[0] : null;
  
  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader className="bg-amber-50 dark:bg-amber-950/30 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Recruitment Bottleneck Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">Loading bottleneck data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32 text-red-500">
            <p>{error}</p>
          </div>
        ) : stageDelays.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">No delay data available</p>
          </div>
        ) : (
          <>
            {criticalBottleneck && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Critical Bottleneck Detected</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded font-medium text-sm">
                    {criticalBottleneck.current_stage}
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-500" />
                  <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded font-medium text-sm">
                    {criticalBottleneck.next_stage}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{criticalBottleneck.avg_delay_days.toFixed(1)} days</span>
                    <span className="text-muted-foreground">avg. delay</span>
                  </div>
                  <div>
                    <span className="font-medium">{criticalBottleneck.max_delay_days.toFixed(1)} days</span>
                    <span className="text-muted-foreground ml-1">max delay</span>
                  </div>
                  <div>
                    <span className="font-medium">{criticalBottleneck.transition_count}</span>
                    <span className="text-muted-foreground ml-1">transitions</span>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-3">All Recruitment Stage Transitions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Avg. Delay (Days)</TableHead>
                    <TableHead className="text-right">Max Delay (Days)</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stageDelays.map((delay, index) => (
                    <TableRow key={index} className={index === 0 ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                      <TableCell className="font-medium">{delay.current_stage}</TableCell>
                      <TableCell>{delay.next_stage}</TableCell>
                      <TableCell className="text-right">{delay.avg_delay_days.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{delay.max_delay_days.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{delay.transition_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
