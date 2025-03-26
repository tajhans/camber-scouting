"use client";

import { useSession } from "@/lib/auth/auth-client";

import { Separator } from "@/components/ui/separator";

export default function Home() {
    const { data: session } = useSession();

    console.log(session);

    return (
        <div className="container mx-auto p-4">
            <div className="text-center pb-4">
                <h1 className="text-2xl font-bold pb-2">Camber Scouting</h1>
                <Separator />
            </div>
        </div>
    );
}
