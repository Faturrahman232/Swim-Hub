"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function formatTimestampForInput(timestamp: string) {
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16); // format: "YYYY-MM-DDTHH:MM"
}

export default function PoolMonitoringPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const current = await getCurrentUser();
      if (!current || current.role_id !== 1) {
        router.push("/");
        return;
      }
      setUser(current);

      const res = await fetch("/api/admin/pool-monitoring");
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, [router]);

  const handleSubmit = async () => {
    if (!selected) return;
    const res = await fetch(
      `/api/admin/pool-monitoring${selected.id ? `/${selected.id}` : ""}`,
      {
        method: selected.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      }
    );

    if (res.ok) {
      const updated = await fetch("/api/admin/pool-monitoring").then((r) =>
        r.json()
      );
      setData(updated);
      setSelected(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    const res = await fetch(`/api/admin/pool-monitoring/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setData(data.filter((d) => d.id !== id));
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Monitoring Kolam</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setSelected({})}>Tambah</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selected?.id ? "Edit" : "Tambah"} Monitoring
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Timestamp</Label>
                  <input
                    type="datetime-local"
                    value={
                      selected?.timestamp
                        ? formatTimestampForInput(selected.timestamp)
                        : ""
                    }
                  />
                </div>
                <div>
                  <Label>Occupancy</Label>
                  <Input
                    type="number"
                    value={selected?.occupancy ?? ""}
                    onChange={(e) =>
                      setSelected((prev: any) => ({
                        ...prev,
                        occupancy: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Temperature (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={selected?.water_temperature ?? ""}
                    onChange={(e) =>
                      setSelected((prev: any) => ({
                        ...prev,
                        water_temperature: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Kebersihan</Label>
                  <Input
                    value={selected?.cleanliness_level ?? ""}
                    onChange={(e) =>
                      setSelected((prev: any) => ({
                        ...prev,
                        cleanliness_level: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button onClick={handleSubmit}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Kebersihan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {format(new Date(item.timestamp), "EEEE, dd MMMM yyyy", {
                    locale: id,
                  })}
                </TableCell>
                <TableCell>{item.occupancy}</TableCell>
                <TableCell>{item.water_temperature}°C</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.cleanliness_level === "good"
                        ? "bg-green-100 text-green-700"
                        : item.cleanliness_level === "moderate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.cleanliness_level}
                  </span>
                </TableCell>
                <TableCell className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelected(item)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Monitoring</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div>
                          <Label>Timestamp</Label>
                          <Input
                            type="datetime-local"
                            value={selected?.timestamp ?? ""}
                            onChange={(e) =>
                              setSelected((prev: any) => ({
                                ...prev,
                                timestamp: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Occupancy</Label>
                          <Input
                            type="number"
                            value={selected?.occupancy ?? ""}
                            onChange={(e) =>
                              setSelected((prev: any) => ({
                                ...prev,
                                occupancy: Number(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Temperature (°C)</Label>
                          <Input
                            type="number"
                            value={selected?.water_temperature ?? ""}
                            onChange={(e) =>
                              setSelected((prev: any) => ({
                                ...prev,
                                water_temperature: parseFloat(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Kebersihan</Label>
                          <Select
                            value={selected?.cleanliness_level ?? ""}
                            onValueChange={(value: any) =>
                              setSelected((prev: any) =>
                                prev
                                  ? { ...prev, cleanliness_level: value }
                                  : prev
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tingkat kebersihan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleSubmit}>Simpan Perubahan</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
