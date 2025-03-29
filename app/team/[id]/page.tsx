import { cookies } from "next/headers";
import { CreateMatchForm } from "@/components/create-match-form";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchTable } from "@/components/match-table";

export default async function Team({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const authCookie =
    cookieStore.get("better-auth.session_token") ||
    cookieStore.get("__Secure-better-auth.session_token");

  const data = await fetch(`${process.env.BASE_URL}/api/team/${id}`, {
    headers: {
      Cookie: `${authCookie?.name}=${authCookie?.value}`,
    },
  });

  if (!data.ok) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-px w-full mt-2" />
        </div>
        <div className="flex flex-col items-center min-h-screen">
          <div className="w-[600px] mt-4">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  const [team] = await data.json();

  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-bold py-2">
          Team {team.name} | {team.id}
        </h1>
      </div>
      <div className="flex flex-col items-center min-h-screen -w-[700px]">
        <div className="mt-4">
          <MatchTable teamId={parseInt(id)} />
        </div>
        <div className="mt-4">
          <CreateMatchForm teamId={team.id} />
        </div>
      </div>
    </div>
  );
}
