"use client";

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormLabel } from "./ui/form";

async function getFetcher(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch match data");
    }
    return response.json();
}

async function fetcher(
    url: string,
    { arg }: { arg: z.infer<typeof matchSchema> },
) {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update match data");
    }

    return response.json();
}

const matchSchema = z.object({
    teamId: z.number().int().positive(),
    coralL1: z.number().int().min(0),
    coralL2: z.number().int().min(0),
    coralL3: z.number().int().min(0),
    coralL4: z.number().int().min(0),
    leftInAuton: z.boolean(),
    pointsScoredInAuton: z.boolean(),
    algaeInProcessor: z.number().int().min(0),
    algaeTakenOff: z.number().int().min(0),
    algaeInNet: z.number().int().min(0),
    humanPlayer: z.boolean(),
    groundIntake: z.boolean(),
    droppedCoral: z.number().int().min(0),
    droppedAlgae: z.number().int().min(0),
    penaltyPoints: z.number().int().min(0),
    yellowCards: z.number().int().min(0),
});

type CoralLevelKey = `coralL${1 | 2 | 3 | 4}`;
type AlgaeKey = "algaeInProcessor" | "algaeTakenOff" | "algaeInNet";
type PenaltyKey =
    | "droppedCoral"
    | "droppedAlgae"
    | "penaltyPoints"
    | "yellowCards";

export function MatchForm({
    teamId,
    matchId,
}: {
    teamId: number;
    matchId: number;
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: matchData, error } = useSWR(
        `/api/match/${matchId}`,
        getFetcher,
    );
    const { trigger } = useSWRMutation(`/api/match/${matchId}`, fetcher);

    const form = useForm<z.infer<typeof matchSchema>>({
        resolver: zodResolver(matchSchema),
        defaultValues: matchData || {
            teamId,
            coralL1: 0,
            coralL2: 0,
            coralL3: 0,
            coralL4: 0,
            leftInAuton: false,
            pointsScoredInAuton: false,
            algaeInProcessor: 0,
            algaeTakenOff: 0,
            algaeInNet: 0,
            humanPlayer: false,
            groundIntake: false,
            droppedCoral: 0,
            droppedAlgae: 0,
            penaltyPoints: 0,
            yellowCards: 0,
        },
        values: matchData,
    });

    if (error) {
        return (
            <div className="text-center text-red-500">
                Failed to load match data. Please try again later.
            </div>
        );
    }

    if (!matchData) {
        return (
            <div className="space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-7 w-32" />
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-9 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-7 w-32" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </div>
                <Skeleton className="h-9 w-full" />
            </div>
        );
    }

    async function onSubmit(values: z.infer<typeof matchSchema>) {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating match data...");

        try {
            await trigger(values);
            toast.success("Match data updated successfully!", { id: toastId });
            router.push(`/team/${teamId}`);
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update match data",
                { id: toastId },
            );
        }

        setIsSubmitting(false);
    }

    const NumberInput = ({
        value,
        onChange,
        label,
    }: {
        value: number;
        onChange: (value: number) => void;
        label: string;
    }) => (
        <div className="flex items-center justify-between gap-4">
            <Button
                type="button"
                variant="outline"
                size="default"
                className="h-12 w-12 text-xl font-semibold"
                onClick={() => onChange(Math.max(0, value - 1))}
            >
                -
            </Button>
            <div className="flex-1 text-center">
                <div className="text-2xl font-semibold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
            </div>
            <Button
                type="button"
                variant="outline"
                size="default"
                className="h-12 w-12 text-xl font-semibold"
                onClick={() => onChange(value + 1)}
            >
                +
            </Button>
        </div>
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Autonomous Period */}
                <div className="rounded-lg border p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Autonomous Period</h2>
                    <div className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="leftInAuton"
                            render={({ field }) => (
                                <Button
                                    type="button"
                                    variant={
                                        field.value ? "default" : "outline"
                                    }
                                    className="w-full h-16"
                                    onClick={() => field.onChange(!field.value)}
                                >
                                    {field.value
                                        ? "Left Starting Zone ✓"
                                        : "Left Starting Zone"}
                                </Button>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pointsScoredInAuton"
                            render={({ field }) => (
                                <Button
                                    type="button"
                                    variant={
                                        field.value ? "default" : "outline"
                                    }
                                    className="w-full h-16"
                                    onClick={() => field.onChange(!field.value)}
                                >
                                    {field.value
                                        ? "Scored Points ✓"
                                        : "Scored Points"}
                                </Button>
                            )}
                        />
                    </div>
                </div>

                {/* Coral Scoring */}
                <div className="rounded-lg border p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Coral Scoring</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {["L1", "L2", "L3", "L4"].map((level) => (
                            <FormField
                                key={`coral${level}`}
                                control={form.control}
                                name={`coral${level}` as CoralLevelKey}
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-center block">
                                            Level {level}
                                        </FormLabel>
                                        <NumberInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            label="Coral"
                                        />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Algae Collection */}
                <div className="rounded-lg border p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Algae Collection</h2>
                    <div className="grid gap-6">
                        {[
                            ["algaeInProcessor", "In Processor"],
                            ["algaeTakenOff", "Taken Off"],
                            ["algaeInNet", "In Net"],
                        ].map(([name, label]) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name as AlgaeKey}
                                render={({ field }) => (
                                    <FormItem>
                                        <NumberInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            label={label}
                                        />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Robot Capabilities */}
                <div className="rounded-lg border p-6 space-y-6">
                    <h2 className="text-xl font-semibold">
                        Robot Capabilities
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="humanPlayer"
                            render={({ field }) => (
                                <Button
                                    type="button"
                                    variant={
                                        field.value ? "default" : "outline"
                                    }
                                    className="w-full h-16"
                                    onClick={() => field.onChange(!field.value)}
                                >
                                    {field.value
                                        ? "Human Player ✓"
                                        : "Human Player"}
                                </Button>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="groundIntake"
                            render={({ field }) => (
                                <Button
                                    type="button"
                                    variant={
                                        field.value ? "default" : "outline"
                                    }
                                    className="w-full h-16"
                                    onClick={() => field.onChange(!field.value)}
                                >
                                    {field.value
                                        ? "Ground Intake ✓"
                                        : "Ground Intake"}
                                </Button>
                            )}
                        />
                    </div>
                </div>

                {/* Penalties & Drops */}
                <div className="rounded-lg border p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Penalties & Drops</h2>
                    <div className="grid gap-6">
                        {[
                            ["droppedCoral", "Dropped Coral"],
                            ["droppedAlgae", "Dropped Algae"],
                            ["penaltyPoints", "Penalty Points"],
                            ["yellowCards", "Yellow Cards"],
                        ].map(([name, label]) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name as PenaltyKey}
                                render={({ field }) => (
                                    <FormItem>
                                        <NumberInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            label={label}
                                        />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Match Data"
                    )}
                </Button>
            </form>
        </Form>
    );
}
