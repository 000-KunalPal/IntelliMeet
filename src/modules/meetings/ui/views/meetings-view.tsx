"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataTablePagination } from "@/components/data-pagination";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilters();

    const { data: meetings } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({
            ...filters,
        }),
    )
    return (
        <div className="flex flex-1 flex-col gap-y-4 pb-4 px-4 md:px-8">
            <DataTable columns={columns} data={meetings.items} onRowClick={(row) => router.push(`/meetings/${row.id}`)} />
            <DataTablePagination
                page={filters.page}
                totalPages={meetings.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {meetings.items.length === 0 && (
                <EmptyState title="No meetings found" description="Create a meeting to get started." />
            )}
        </div>
    )
}

export const MeetingsViewLoading = () => {
    return (
        <LoadingState title="Loading meetings..." description="Please wait while we load the meetings." />
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState title="Error loading meetings" description="Please try again later." />
    )
} 