"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Menu } from "lucide-react";

type Booking = {
  id: number;
  user_name: string;
  booking_date: string;
  guests_count: number;
  status: string;
  session: string;
};

export default function AdminBookingsPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const current = await getCurrentUser();
      if (!current || current.role_id !== 1) {
        router.push("/");
        return;
      }
      setUser(current);

      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    };

    fetchData();
  }, [router]);

  const handleEdit = async () => {
    if (!selected) return;
    await fetch(`/api/admin/bookings/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === selected.id ? selected : b))
    );
    setSelected(null);
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 relative">
      {/* Sidebar: responsive */}
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

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 space-y-6 container mx-auto">
        {/* Toggle button */}
        <button
          className="md:hidden text-gray-800 dark:text-white mb-4"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-bold">Kelola Penyewaan</h1>

        <Card>
          <CardHeader>Daftar Booking</CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">ID</th>
                  <th>User</th>
                  <th>Tanggal</th>
                  <th>Tamu</th>
                  <th>Sesi</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="py-2">{b.id}</td>
                    <td>{b.user_name}</td>
                    <td>
                      {format(new Date(b.booking_date), "EEEE, dd MMMM yyyy", {
                        locale: id,
                      })}
                    </td>
                    <td>{b.guests_count}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          b.session === "sesi1"
                            ? "bg-blue-100 text-blue-700"
                            : b.session === "sesi2"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {b.session === "sesi1"
                          ? "Sesi 1 (09.00 - 13.00)"
                          : b.session === "sesi2"
                          ? "Sesi 2 (14.00 - 18.00)"
                          : "Full Day"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          b.status === "paid" || b.status === "success"
                            ? "bg-green-100 text-green-700"
                            : b.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelected({ ...b })}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <h2 className="text-lg font-semibold mb-4">
                            Edit Booking #{b.id}
                          </h2>
                          <div className="space-y-2">
                            <Label>Jumlah Tamu</Label>
                            <Input
                              type="number"
                              value={selected?.guests_count ?? 0}
                              onChange={(e) =>
                                setSelected((prev) =>
                                  prev
                                    ? { ...prev, guests_count: +e.target.value }
                                    : prev
                                )
                              }
                            />
                            <Label>Sesi</Label>
                            <select
                              className="w-full border rounded px-3 py-2 text-sm"
                              value={selected?.session ?? ""}
                              onChange={(e) =>
                                setSelected((prev) =>
                                  prev
                                    ? { ...prev, session: e.target.value }
                                    : prev
                                )
                              }
                            >
                              <option value="sesi1">
                                Sesi 1 (09.00 - 13.00)
                              </option>
                              <option value="sesi2">
                                Sesi 2 (14.00 - 18.00)
                              </option>
                              <option value="fullday">
                                Full Day (09.00 - 18.00)
                              </option>
                            </select>
                            <Label>Status</Label>
                            <select
                              className="w-full border rounded px-3 py-2 text-sm"
                              value={selected?.status ?? ""}
                              onChange={(e) =>
                                setSelected((prev) =>
                                  prev
                                    ? { ...prev, status: e.target.value }
                                    : prev
                                )
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="failed">Failed</option>
                            </select>
                            <Button className="mt-4" onClick={handleEdit}>
                              Simpan Perubahan
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
