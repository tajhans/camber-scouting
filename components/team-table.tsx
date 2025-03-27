"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TeamTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data, error, isLoading } = useSWR(
        `/api/team?page=${page}&search=${debouncedSearch}`,
        fetcher,
    );

    const handleSearch = (value: string) => {
        setSearch(value);
        setTimeout(() => {
            setDebouncedSearch(value);
            setPage(1);
        }, 300);
    };

    if (error) return <div>Failed to load teams</div>;
    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search teams..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Team Number</TableHead>
                        <TableHead>Team Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.teams.map((team: { id: number; name: string }) => (
                        <TableRow key={team.id}>
                            <TableCell>
                                <Link href={`/team/${team.id}`}>{team.id}</Link>
                            </TableCell>
                            <TableCell>{team.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.totalPages}
                >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
