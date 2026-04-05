"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartDataItem = {
  hour: string;
  occupancy: number;
  forecast: number;
};

export function PoolOccupancyChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const generateMockData = (): ChartDataItem[] => {
      const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"];

      return hours.map((hour) => {
        let baseOccupancy;
        if (hour === "6AM" || hour === "8PM") {
          baseOccupancy = 20;
        } else if (hour === "10AM" || hour === "2PM") {
          baseOccupancy = 60;
        } else if (hour === "12PM") {
          baseOccupancy = 50;
        } else {
          baseOccupancy = 40;
        }

        const randomVariation = Math.floor(Math.random() * 20) - 10;
        const occupancy = Math.max(5, Math.min(90, baseOccupancy + randomVariation));

        return {
          hour,
          occupancy,
          forecast: Math.max(
            5,
            Math.min(90, occupancy + Math.floor(Math.random() * 30) - 15)
          ),
        };
      });
    };

    setChartData(generateMockData());
  }, []);

  if (!mounted) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="hour"
          tick={{ fill: "var(--gray-600)" }}
          tickLine={{ stroke: "var(--gray-400)" }}
        />
        <YAxis
          tickFormatter={(value) => `${value}%`}
          tick={{ fill: "var(--gray-600)" }}
          tickLine={{ stroke: "var(--gray-400)" }}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Occupancy"]}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="occupancy"
          name="Current Occupancy"
          stroke="hsl(var(--chart-1))"
          fill="hsl(var(--chart-1) / 0.2)"
          activeDot={{ r: 8 }}
        />
        <Area
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="hsl(var(--chart-2))"
          fill="hsl(var(--chart-2) / 0.2)"
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}