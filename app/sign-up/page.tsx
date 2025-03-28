"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/auth-client";
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

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

async function fetcher(
  url: string,
  { arg }: { arg: z.infer<typeof signUpSchema> },
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
    throw new Error(error.error || "An error occurred while signing up");
  }

  return response.json();
}

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, isPending } = useSession();

  const { trigger, isMutating } = useSWRMutation("/api/sign-up", fetcher);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);

    const toastId = toast.loading("Creating your account...");

    try {
      await trigger(values);

      toast.success("Account created successfully!", { id: toastId });

      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account",
        { id: toastId },
      );
    }

    setIsSubmitting(false);
  }

  useEffect(() => {
    if (session && !isPending) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>This is your name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormDescription>This is your email.</FormDescription>
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
                    <FormDescription>This is your password.</FormDescription>
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
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
