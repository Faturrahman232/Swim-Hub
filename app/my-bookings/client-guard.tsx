"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ClientGuard() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Akses ditolak",
      description: "Silakan login terlebih dahulu.",
    });

    router.replace("/");
  }, [router, toast]);

  return null;
}
