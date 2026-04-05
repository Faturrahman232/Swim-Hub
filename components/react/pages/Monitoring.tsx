
import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/react/components/layout/Navbar';
import Footer from '@/components/react/components/layout/Footer';
import { supabase } from '@/components/react/integrations/supabase/client';
import StatusBadge from '@/components/react/components/ui/StatusBadge';
import { AreaChart, Area } from 'recharts';
import { format, subHours } from 'date-fns';

type PoolStatus = 'open' | 'closed' | 'maintenance';

interface PoolStatusData {
  id: string;
  status: PoolStatus;
  current_occupancy: number;
  max_occupancy: number;
  water_temperature: number | null;
  chlorine_level: number | null;
  ph_level: number | null;
  last_cleaned_at: string | null;
  next_cleaning_at: string | null;
  updated_at: string;
}

interface OccupancyData {
  time: string;
  occupancy: number;
}

const getOccupancyPercentage = (current: number, max: number) => {
  return (current / max) * 100;
};

const getOccupancyLevel = (percentage: number) => {
  if (percentage < 30) return 'Low';
  if (percentage < 70) return 'Moderate';
  return 'High';
};

const getOccupancyColor = (percentage: number) => {
  if (percentage < 30) return 'text-green-500';
  if (percentage < 70) return 'text-amber-500';
  return 'text-red-500';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Generate mock historical data
const generateHistoricalData = (): OccupancyData[] => {
  const data = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const time = subHours(now, i);
    // Generate a realistic pattern with peaks during morning and evening
    let baseOccupancy = 30;
    const hour = time.getHours();
    
    // Morning peak (6am - 9am)
    if (hour >= 6 && hour <= 9) {
      baseOccupancy = 60;
    }
    // Evening peak (5pm - 8pm)
    else if (hour >= 17 && hour <= 20) {
      baseOccupancy = 80;
    }
    // Late night (10pm - 5am)
    else if (hour >= 22 || hour <= 5) {
      baseOccupancy = 10;
    }
    
    // Add some randomness
    const randomVariation = Math.floor(Math.random() * 20) - 10;
    const occupancy = Math.max(0, Math.min(100, baseOccupancy + randomVariation));
    
    data.push({
      time: format(time, 'HH:mm'),
      occupancy: occupancy
    });
  }
  
  return data;
};

const Monitoring = () => {
  const [poolStatus, setPoolStatus] = useState<PoolStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [historicalData] = useState<OccupancyData[]>(generateHistoricalData());
  const { toast } = useToast();

  useEffect(() => {
    const fetchPoolStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('pool_status')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          throw error;
        }
        
        setPoolStatus(data as PoolStatusData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch pool status. " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPoolStatus();
    
    // Set up real-time subscription for pool status updates
    const subscription = supabase
      .channel('pool_status_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'pool_status' }, 
        (payload) => {
          setPoolStatus(payload.new as PoolStatusData);
        })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const occupancyPercentage = poolStatus ? 
    getOccupancyPercentage(poolStatus.current_occupancy, poolStatus.max_occupancy) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 bg-gradient-to-b from-swim-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Pool Monitoring</h1>
            <p className="text-gray-600">Real-time updates on pool conditions and occupancy</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-swim-500 border-r-transparent"></div>
            </div>
          ) : !poolStatus ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Pool status information is currently unavailable.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={poolStatus.status as any} />
                      <span className="text-sm text-gray-500">
                        Updated: {format(new Date(poolStatus.updated_at), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Occupancy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className={getOccupancyColor(occupancyPercentage)}>
                          {getOccupancyLevel(occupancyPercentage)}
                        </span>
                        <span className="font-semibold">
                          {poolStatus.current_occupancy} / {poolStatus.max_occupancy}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-swim-500 h-2.5 rounded-full" 
                          style={{ width: `${occupancyPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Water Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Temperature</p>
                        <p className="font-semibold">
                          {poolStatus.water_temperature ? `${poolStatus.water_temperature}°C` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Chlorine Level</p>
                        <p className="font-semibold">
                          {poolStatus.chlorine_level ? `${poolStatus.chlorine_level} ppm` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">pH Level</p>
                        <p className="font-semibold">
                          {poolStatus.ph_level || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Cleaned</p>
                        <p className="font-semibold">
                          {poolStatus.last_cleaned_at ? 
                            format(new Date(poolStatus.last_cleaned_at), 'MMM dd, HH:mm') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Occupancy Over Time (Last 24 Hours)</CardTitle>
                  <CardDescription>
                    Historical pool attendance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={historicalData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="time" 
                          minTickGap={30}
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }} 
                        />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="occupancy" 
                          stroke="#0EA5E9" 
                          fillOpacity={1} 
                          fill="url(#colorOccupancy)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Peak Hours</CardTitle>
                    <CardDescription>
                      Most busy times during the week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { day: 'Mon', morning: 60, evening: 75 },
                            { day: 'Tue', morning: 45, evening: 60 },
                            { day: 'Wed', morning: 50, evening: 70 },
                            { day: 'Thu', morning: 65, evening: 55 },
                            { day: 'Fri', morning: 70, evening: 80 },
                            { day: 'Sat', morning: 85, evening: 70 },
                            { day: 'Sun', morning: 80, evening: 65 },
                          ]}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="morning" name="Morning (6-10am)" fill="#60A5FA" />
                          <Bar dataKey="evening" name="Evening (5-9pm)" fill="#34D399" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>
                      Upcoming pool maintenance information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {poolStatus.next_cleaning_at ? (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-500">Next scheduled cleaning</p>
                          <p className="font-semibold">
                            {format(new Date(poolStatus.next_cleaning_at), 'MMMM dd, yyyy - HH:mm')}
                          </p>
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold mb-2">Regular Maintenance</h4>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span>Water testing</span>
                              <span>Daily</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Filter cleaning</span>
                              <span>Weekly</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Deep cleaning</span>
                              <span>Monthly</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="py-4 text-center text-gray-500">
                        No maintenance schedule available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Monitoring;
