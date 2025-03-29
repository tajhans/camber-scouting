import { cookies } from "next/headers";
import { MatchSummary } from "@/components/match-summary";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Match({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("better-auth.session_token");

  const data = await fetch(`${process.env.BASE_URL}/api/match/${id}`, {
    headers: {
      Cookie: `better-auth.session_token=${authCookie?.value}`,
    },
  });

  if (!data.ok) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center pb-4">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-px w-full" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-[800px] w-full" />
        </div>
      </div>
    );
  }

  const match = await data.json();

  return (
    <div className="container mx-auto p-4">
      <div className="text-center pb-4">
        <h1 className="text-2xl font-bold pb-2">Match Scouting</h1>
        <Separator />
      </div>
      <MatchSummary
        teamId={match.teamId}
        matchId={Number.parseInt(id)}
        matchData={match}
      />
    </div>
  );
}
