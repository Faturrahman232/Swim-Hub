
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/ui/StatusBadge";

interface PoolStatsProps {
  occupancy: number;
  waterQuality: number;
  temperature: number;
  status: 'open' | 'closed' | 'maintenance';
}

export function PoolStats({ occupancy, waterQuality, temperature, status }: PoolStatsProps) {
  const getWaterQualityColor = (quality: number) => {
    if (quality > 90) return 'text-green-600';
    if (quality > 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp < 26) return 'Cold';
    if (temp < 28) return 'Ideal';
    return 'Warm';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 26) return 'text-blue-600';
    if (temp < 28) return 'text-green-600';
    return 'text-orange-600';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-swim-500 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Pool Status</CardTitle>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Current Occupancy</span>
              <span className="text-sm font-medium">{occupancy}%</span>
            </div>
            <Progress value={occupancy} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {occupancy >= 90 ? 'Pool is almost at capacity' : 
               occupancy >= 50 ? 'Moderate occupancy' : 'Low occupancy'}
            </p>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Water Quality</span>
              <span className={`text-sm font-medium ${getWaterQualityColor(waterQuality)}`}>{waterQuality}%</span>
            </div>
            <Progress value={waterQuality} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {waterQuality > 90 ? 'Excellent' : 
               waterQuality > 70 ? 'Good' : 'Needs attention'}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium mb-1">Water Temperature</h4>
              <p className={`text-2xl font-bold ${getTemperatureColor(temperature)}`}>{temperature}°C</p>
              <p className="text-xs text-muted-foreground">{getTemperatureLabel(temperature)}</p>
            </div>
            <div className="h-16 w-16 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-swim-100 to-swim-500 overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-swim-500 transition-all duration-500"
                  style={{ height: `${Math.min(100, Math.max(0, ((temperature - 22) / 10) * 100))}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                {temperature}°C
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PoolStats;
