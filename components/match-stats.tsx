"use client";

import useSWR from "swr";
import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MatchStats {
  totalMatches: number;
  recentMatches: number;
}

export function MatchStats() {
  const { data, error, isLoading } = useSWR<MatchStats>(
    "/api/stats/matches",
    fetcher,
  );

  if (error) return <div>Failed to load match statistics</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Matches Recorded</CardTitle>
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold">{data?.totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              {data?.recentMatches} in last 24h
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
