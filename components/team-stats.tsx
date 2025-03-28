"use client";

import useSWR from "swr";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TeamStats {
  totalTeams: number;
}

export function TeamStats() {
  const { data, error, isLoading } = useSWR<TeamStats>(
    "/api/stats/teams",
    fetcher,
  );

  if (error) return <div>Failed to load team statistics</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <div className="text-2xl font-bold">{data?.totalTeams}</div>
        )}
      </CardContent>
    </Card>
  );
}
