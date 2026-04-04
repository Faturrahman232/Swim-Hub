"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Sidebar from "@/components/admin/sidebar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Menu } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// ... semua import tetap

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<any>({ daily: [], monthly: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false); // 👈 ini untuk toggle sidebar
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndReport = async () => {
      const current = await getCurrentUser();
      if (!current || current.role_id !== 1) {
        router.push("/");
        return;
      }
      setUser(current);

      const res = await fetch("/api/admin/report");
      const data = await res.json();
      setReport(data);
    };

    fetchUserAndReport();
  }, [router]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 relative">
      {/* Sidebar */}
      <div
        className={`fixed z-40 md:static transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay ketika sidebar terbuka di mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Konten utama */}
      <main className="flex-1 p-4 md:p-6 space-y-6 container mx-auto">
        {/* Toggle hamburger (mobile only) */}
        <button
          className="md:hidden text-gray-800 dark:text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard Admin
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="text-base md:text-lg font-semibold">
              Laporan Per Hari
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar
                data={{
                  labels: report.daily.map((d: any) =>
                    format(new Date(d.date), "EEEE, dd MMMM yyyy", {
                      locale: id,
                    })
                  ),
                  datasets: [
                    {
                      label: "Total (IDR)",
                      data: report.daily.map((d: any) => d.total),
                      backgroundColor: "#3b82f6",
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-base md:text-lg font-semibold">
              Laporan Per Bulan
            </CardHeader>
            <CardContent className="h-[300px]">
              <Line
                data={{
                  labels: report.monthly.map((m: any) =>
                    format(new Date(m.month), "MMMM - yyyy", { locale: id })
                  ),
                  datasets: [
                    {
                      label: "Total (IDR)",
                      data: report.monthly.map((m: any) => m.total),
                      borderColor: "#ef4444",
                      backgroundColor: "rgba(239,68,68,0.2)",
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-base md:text-lg font-semibold">
              Laporan Per Minggu
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar
                data={{
                  labels:
                    report.weekly?.map(
                      (w: any) =>
                        `${format(new Date(w.start_date), "dd MMM", {
                          locale: id,
                        })} - ${format(new Date(w.end_date), "dd MMM yyyy", {
                          locale: id,
                        })}`
                    ) ?? [],
                  datasets: [
                    {
                      label: "Total (IDR)",
                      data: report.weekly?.map((w: any) => w.total) ?? [],
                      backgroundColor: "#10b981",
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
