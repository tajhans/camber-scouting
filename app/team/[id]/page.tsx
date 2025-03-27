import { cookies } from "next/headers";

export default async function Team({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const cookieStore = await cookies();
    const authCookie = cookieStore.get("better-auth.session_token");

    const data = await fetch(`http://100.119.141.108:3000/api/team/${id}`, {
        headers: {
            Cookie: `better-auth.session_token=${authCookie?.value}`,
        },
    });
    const [team] = await data.json();

    return (
        <div>
            <h1>
                Team {team.name} | {team.id}
            </h1>
        </div>
    );
}
