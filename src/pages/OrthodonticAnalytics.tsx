import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const OrthodonticAnalytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('orthodontic_usage_logs')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const daily: any = {};
      data?.forEach(log => {
        const date = new Date(log.created_at).toLocaleDateString();
        if (!daily[date]) {
          daily[date] = { uploads: 0, analyses: 0, successes: 0, errors: 0 };
        }
        if (log.event_type === 'upload') daily[date].uploads++;
        if (log.event_type === 'analysis_start') daily[date].analyses++;
        if (log.event_type === 'analysis_success') daily[date].successes++;
        if (log.event_type === 'analysis_error') daily[date].errors++;
      });

      setStats({
        total: data?.length || 0,
        daily,
        recentLogs: data?.slice(0, 10) || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-8">
          <Card>
            <CardContent className="py-12 text-center">Loading statistics...</CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Orthodontic Analyzer Usage Statistics
            </h1>
            <p className="text-lg text-muted-foreground">
              Internal analytics dashboard
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Usage Statistics (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.daily).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No usage data yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Date</th>
                          <th className="text-right py-2 px-4">Uploads</th>
                          <th className="text-right py-2 px-4">Analyses</th>
                          <th className="text-right py-2 px-4">Successful</th>
                          <th className="text-right py-2 px-4">Errors</th>
                          <th className="text-right py-2 px-4">Success Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(stats.daily).map(([date, counts]: [string, any]) => (
                          <tr key={date} className="border-b">
                            <td className="py-2 px-4 font-medium">{date}</td>
                            <td className="text-right py-2 px-4">{counts.uploads}</td>
                            <td className="text-right py-2 px-4">{counts.analyses}</td>
                            <td className="text-right py-2 px-4 text-green-600">{counts.successes}</td>
                            <td className="text-right py-2 px-4 text-red-600">{counts.errors}</td>
                            <td className="text-right py-2 px-4">
                              {counts.analyses > 0 
                                ? `${Math.round((counts.successes / counts.analyses) * 100)}%`
                                : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Events</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {(Object.values(stats.daily) as any[]).reduce((sum: number, d: any) => sum + d.uploads, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Uploads</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {(Object.values(stats.daily) as any[]).reduce((sum: number, d: any) => sum + d.analyses, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Analyses</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(Object.values(stats.daily) as any[]).reduce((sum: number, d: any) => sum + d.successes, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrthodonticAnalytics;
