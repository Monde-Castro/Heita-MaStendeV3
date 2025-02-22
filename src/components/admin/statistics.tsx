import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Statistics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    verifiedListings: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: totalUsers },
        { count: totalListings },
        { count: verifiedListings },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("listings").select("*", { count: "exact", head: true }),
        supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("verified", true),
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        totalListings: totalListings || 0,
        verifiedListings: verifiedListings || 0,
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalListings}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Verified Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.verifiedListings}</div>
        </CardContent>
      </Card>
    </div>
  );
}
