"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xl font-bold text-primary"
                        >
                            <span className="text-2xl text-bold">
                                Camber Scouting
                            </span>
                        </Link>
                    </div>
                    <div>
                        {!session ? (
                            <div className="flex gap-4">
                                <Link href="/sign-in">
                                    <Button
                                        variant="outline"
                                        className="font-medium"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button className="font-medium shadow-sm hover:shadow">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-1 font-medium"
                                    >
                                        {session.user?.name || "Account"}
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-[200px]"
                                >
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                                        onClick={async () => {
                                            await signOut({
                                                fetchOptions: {
                                                    onSuccess: () => {
                                                        router.push("/sign-in");
                                                    },
                                                },
                                            });
                                        }}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
