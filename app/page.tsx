import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

import { CreateTeamForm } from "@/components/create-team-form";
import { TeamTable } from "@/components/team-table";
import { TeamStats } from "@/components/team-stats";
import { MatchStats } from "@/components/match-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center space-y-6 max-w-md px-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Camber Scouting
          </h1>
          <p className="text-lg text-muted-foreground">
            A powerful tool for FRC team scouting and data analysis.
          </p>
          <Link
            href="https://github.com/tajhans/camber-scouting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              height="24"
              width="24"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Check out the code on GitHub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {session.user?.name || "Scout"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze team performances.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TeamStats />
        <MatchStats />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Add New Team</CardTitle>
            <CardDescription>Register a team for scouting</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTeamForm />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Teams</CardTitle>
            <CardDescription>View and manage scouted teams</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
