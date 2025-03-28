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
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create team",
        { id: toastId },
      );
    }

    setIsSubmitting(false);
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        : Number.parseInt(e.target.value),
                    )
                  }
                />
              </FormControl>
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
                <Input placeholder="Camber" {...field} />
              </FormControl>
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
              Creating team...
            </>
          ) : (
            "Add Team"
          )}
        </Button>
      </form>
    </Form>
  );
}
