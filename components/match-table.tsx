"use client";

import useSWR from "swr";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Match {
  matchNumber: number;
  alliance: string;
  position: number;
  coralL1: number;
  coralL2: number;
  coralL3: number;
  coralL4: number;
  leftInAuton: boolean;
  pointsScoredInAuton: boolean;
  algaeInProcessor: number;
  algaeTakenOff: number;
  algaeInNet: number;
  humanPlayer: boolean;
  groundIntake: boolean;
  droppedCoral: number;
  droppedAlgae: number;
  penaltyPoints: number;
  yellowCards: number;
}

export function MatchTable({ teamId }: { teamId: number }) {
  const { data, error, isLoading } = useSWR<Match[]>(
    `/api/team/${teamId}/matches`,
    fetcher,
  );

  if (error) return <div>Failed to load matches</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Match History</h2>
        <div className="text-sm text-muted-foreground">
          {!isLoading && data && data.length > 0 && `${data.length} matches`}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Match</TableHead>
              <TableHead className="w-[100px]">Alliance</TableHead>
              <TableHead className="w-[80px]">Position</TableHead>
              <TableHead>Coral Score</TableHead>
              <TableHead>Algae Score</TableHead>
              <TableHead>Penalties</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No matches recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((match) => (
                <TableRow key={match.matchNumber}>
                  <TableCell className="font-medium">
                    {match.matchNumber}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        match.alliance === "red"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800",
                      )}
                    >
                      {match.alliance.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{match.position}</TableCell>
                  <TableCell>
                    {match.coralL1 +
                      match.coralL2 +
                      match.coralL3 +
                      match.coralL4}
                  </TableCell>
                  <TableCell>
                    {match.algaeInProcessor +
                      match.algaeTakenOff +
                      match.algaeInNet}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{match.penaltyPoints}</span>
                      {match.yellowCards > 0 && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                          {match.yellowCards} YC
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/match/${match.matchNumber}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
