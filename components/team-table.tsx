"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Team {
  id: number;
  name: string;
}

interface TeamResponse {
  teams: Team[];
  totalPages: number;
}

export function TeamTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, error, isLoading } = useSWR<TeamResponse>(
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search teams by number or name..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {!isLoading &&
            data?.teams &&
            data.teams.length > 0 &&
            `Showing ${data.teams.length} teams`}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Team Number</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-9 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No teams found.
                </TableCell>
              </TableRow>
            ) : (
              data?.teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.id}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    <Link href={`/team/${team.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {data?.totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === data?.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
