import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { Separator } from "@/components/ui/separator";
import { CreateTeamForm } from "@/components/create-team-form";
import { TeamTable } from "@/components/team-table";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome to Camber Scouting</h1>
          <p className="text-lg text-muted-foreground">
            A tool for FRC team scouting and data analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        <CreateTeamForm />
        <Separator />
        <TeamTable />
      </div>
    </div>
  );
}
