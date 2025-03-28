"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const createMatchSchema = z.object({
    matchNumber: z.number().int().positive(),
    teamId: z.number().int().positive(),
    alliance: z.enum(["red", "blue"]),
    position: z.enum(["1", "2", "3"]),
    redAlliance: z
        .array(z.number().int().positive())
        .length(3, "Red alliance must have exactly 3 teams"),
    blueAlliance: z
        .array(z.number().int().positive())
        .length(3, "Blue alliance must have exactly 3 teams"),
});

async function fetcher(
    url: string,
    { arg }: { arg: z.infer<typeof createMatchSchema> },
) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
    });

    if (!response.ok) {
        throw new Error("Failed to create match");
    }

    return response.json();
}

export function CreateMatchForm({ teamId }: { teamId: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { trigger } = useSWRMutation("/api/match/create", fetcher);

    const form = useForm<z.infer<typeof createMatchSchema>>({
        resolver: zodResolver(createMatchSchema),
        defaultValues: {
            teamId: teamId,
            alliance: "blue",
            position: "1",
            redAlliance: [0, 0, 0],
            blueAlliance: [teamId, 0, 0],
        },
    });

    const alliance = form.watch("alliance");
    const position = form.watch("position");

    useEffect(() => {
        const newRedAlliance = [0, 0, 0];
        const newBlueAlliance = [0, 0, 0];

        const positionIndex = parseInt(position) - 1;

        if (alliance === "red") {
            newRedAlliance[positionIndex] = teamId;
        } else {
            newBlueAlliance[positionIndex] = teamId;
        }

        form.setValue("redAlliance", newRedAlliance);
        form.setValue("blueAlliance", newBlueAlliance);
    }, [alliance, position, teamId, form]);

    async function onSubmit(values: z.infer<typeof createMatchSchema>) {
        setIsSubmitting(true);
        const toastId = toast.loading("Creating match...");

        try {
            const response = await trigger(values);
            toast.success("Match created successfully!", { id: toastId });
            router.push(`/match/${response.matchNumber}`);
        } catch (error) {
            console.log(error);
            toast.error("Failed to create match", { id: toastId });
        }

        setIsSubmitting(false);
    }

    return (
        <div className="rounded-lg border p-6 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">Create Match</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border p-4 space-y-4">
                            <h2 className="text-lg font-semibold">
                                Match Information
                            </h2>
                            <FormField
                                control={form.control}
                                name="matchNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Match Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="1"
                                                value={field.value || ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ""
                                                            ? 0
                                                            : parseInt(
                                                                  e.target
                                                                      .value,
                                                              ),
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the match number
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="rounded-lg border p-4 space-y-4">
                            <h2 className="text-lg font-semibold">
                                Team Position
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="alliance"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alliance</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className={`${
                                                            field.value ===
                                                            "red"
                                                                ? "bg-red-100 border-red-200"
                                                                : "bg-blue-100 border-blue-200"
                                                        }`}
                                                    >
                                                        <SelectValue placeholder="Select alliance" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="red">
                                                        Red Alliance
                                                    </SelectItem>
                                                    <SelectItem value="blue">
                                                        Blue Alliance
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select your alliance color
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Position</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select position" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">
                                                        Position 1
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        Position 2
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        Position 3
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select your robot&apos;s
                                                position
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 space-y-4">
                            <h2 className="text-lg font-semibold text-red-900">
                                Red Alliance
                            </h2>
                            <div className="space-y-4">
                                {[0, 1, 2].map((index) => (
                                    <FormField
                                        key={`red-${index}`}
                                        control={form.control}
                                        name={`redAlliance.${index}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-red-900">
                                                    Position {index + 1}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder={`Team Number`}
                                                        className={`${
                                                            alliance ===
                                                                "red" &&
                                                            index ===
                                                                parseInt(
                                                                    position,
                                                                ) -
                                                                    1
                                                                ? "border-red-500 bg-red-100"
                                                                : ""
                                                        }`}
                                                        {...field}
                                                        disabled={
                                                            alliance ===
                                                                "red" &&
                                                            index ===
                                                                parseInt(
                                                                    position,
                                                                ) -
                                                                    1
                                                        }
                                                        value={
                                                            field.value || ""
                                                        }
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-4">
                            <h2 className="text-lg font-semibold text-blue-900">
                                Blue Alliance
                            </h2>
                            <div className="space-y-4">
                                {[0, 1, 2].map((index) => (
                                    <FormField
                                        key={`blue-${index}`}
                                        control={form.control}
                                        name={`blueAlliance.${index}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-blue-900">
                                                    Position {index + 1}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder={`Team Number`}
                                                        className={`${
                                                            alliance ===
                                                                "blue" &&
                                                            index ===
                                                                parseInt(
                                                                    position,
                                                                ) -
                                                                    1
                                                                ? "border-blue-500 bg-blue-100"
                                                                : ""
                                                        }`}
                                                        {...field}
                                                        disabled={
                                                            alliance ===
                                                                "blue" &&
                                                            index ===
                                                                parseInt(
                                                                    position,
                                                                ) -
                                                                    1
                                                        }
                                                        value={
                                                            field.value || ""
                                                        }
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        Create Match
                    </Button>
                </form>
            </Form>
        </div>
    );
}
