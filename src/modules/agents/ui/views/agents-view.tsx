"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataTablePagination } from "@/components/data-pagination";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";


export const AgentsView = () => {
    const router = useRouter();
    const [filters, setFilters] = useAgentsFilters();

    const trpc = useTRPC();
    const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable columns={columns} data={agents.items} onRowClick={(row) => {
                router.push(`/agents/${row.id}`);
            }} />
            <DataTablePagination
                page={filters.page}
                totalPages={agents.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {agents.items.length === 0 && (
                <EmptyState title="No agents found" description="Create an agent to get started." />
            )}
        </div>
    )
}

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading agents..." description="Please wait while we load the agents." />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState title="Error loading agents" description="Please try again later." />
    )
}