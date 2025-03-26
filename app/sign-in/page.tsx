"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import Link from "next/link";

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

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

async function fetcher(
    url: string,
    { arg }: { arg: z.infer<typeof signInSchema> },
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
        throw new Error(error.error || "Authentication failed");
    }

    return response.json();
}

export default function SignIn() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { trigger, isMutating } = useSWRMutation("/api/sign-in", fetcher);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signInSchema>) {
        setIsSubmitting(true);

        const toastId = toast.loading("Signing in...");

        try {
            await trigger(values);

            toast.success("Signed in successfully!", { id: toastId });

            router.push("/");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Authentication failed",
                { id: toastId },
            );
        }

        setIsSubmitting(false);
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter your email address
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="********"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter your password
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting || isMutating}
                        className="w-full"
                    >
                        {isSubmitting || isMutating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center">
                <p>
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="text-blue-600 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
