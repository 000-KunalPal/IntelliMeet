import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { AgentIdView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agent-id-view";

interface AgentPageProps {
    params: Promise<{ agentId: string }>;
}

const AgentPage = async ({ params }: AgentPageProps) => {
    const { agentId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({
            id: agentId,
        })
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewLoading />}>
                <ErrorBoundary fallback={<AgentsViewError />}>
                    <AgentIdView agentId={agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default AgentPage;