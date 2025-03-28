import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, BarChart, ClipboardList } from "lucide-react";
import Link from "next/link";

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
          <div className="flex justify-center gap-4 pt-2">
            <Button asChild size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {session.user?.name || "Scout"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track, analyze, and improve your team's performance
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
