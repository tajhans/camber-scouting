import { Separator } from "@/components/ui/separator";
import { CreateTeamForm } from "@/components/create-team-form";
import { TeamTable } from "@/components/team-table";

export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <div className="text-center pb-4">
                <h1 className="text-2xl font-bold pb-2">Camber Scouting</h1>
                <Separator />
            </div>
            <div className="space-y-4">
                <CreateTeamForm />
                <Separator />
                <TeamTable />
            </div>
        </div>
    );
}
