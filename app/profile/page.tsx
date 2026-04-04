"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentUser } from "@/utils/getCurrentUser";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  birthdate: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Gagal mengambil data profil");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className="px-6 py-10">Loading profile...</p>;

  if (!profile) return <p className="px-6 py-10">Profil tidak ditemukan.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white p-6 border rounded shadow">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone || "-"}
        </p>
        <p>
          <strong>Address:</strong> {profile.address || "-"}
        </p>
        <p>
          <strong>Birthdate:</strong> {profile.birthdate || "-"}
        </p>

        <div className="mt-6 flex gap-4">
          <Link
            href="/profile/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit Profile
          </Link>
          <Link
            href="/profile/reset-password"
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
}
