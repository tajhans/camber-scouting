"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/auth-client";
import useSWRMutation from "swr/mutation";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const createTeamSchema = z.object({
    id: z.number().int().positive("Team number must be positive"),
    name: z.string().min(1, "Team name is required"),
});

async function fetcher(
    url: string,
    { arg }: { arg: z.infer<typeof createTeamSchema> },
) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create team");
    }

    return response.json();
}

export function CreateTeamForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session, isPending } = useSession();
    const { trigger, isMutating } = useSWRMutation("/api/team", fetcher);

    const form = useForm<z.infer<typeof createTeamSchema>>({
        resolver: zodResolver(createTeamSchema),
        defaultValues: {
            name: "",
        },
    });

    async function onSubmit(values: z.infer<typeof createTeamSchema>) {
        setIsSubmitting(true);

        const toastId = toast.loading("Creating team...");

        try {
            await trigger(values);

            toast.success("Team created successfully!", { id: toastId });

            router.push(`/team/${values.id}`);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create team",
                { id: toastId },
            );
        }

        setIsSubmitting(false);
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="max-w-sm mx-auto">
            <div className="rounded-lg border p-6 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Add New Team
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Add a new FRC team to the scouting system
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="9658"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === ""
                                                        ? ""
                                                        : parseInt(
                                                              e.target.value,
                                                          ),
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the team&apos;s FRC number
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Camber"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the team&apos;s name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting || isMutating}
                            className="w-full pt-2"
                        >
                            {isSubmitting || isMutating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating team...
                                </>
                            ) : (
                                "Add Team"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
