"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface AgentIdViewProps {
    agentId: string;
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()

    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false)

    const { data: agent } = useSuspenseQuery(trpc.agents.getOne.queryOptions({
        id: agentId,
    }))

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
                router.push("/agents")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
        "Are you sure you want to delete this agent?",
        `The following action will remove ${agent.meetingCount} ${agent.meetingCount === 1 ? "meeting" : "meetings"} and all associated data.`
    )

    const handleRemoveAgent = async () => {
        const confirmed = await confirmRemove()
        if (!confirmed) return

        await removeAgent.mutateAsync({ id: agentId })
    }

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: agentId }))
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    return <>
        <RemoveConfirmationDialog />
        <UpdateAgentDialog
            open={updateAgentDialogOpen}
            onOpenChange={setUpdateAgentDialogOpen}
            initialValues={agent}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader agentId={agentId} agentName={agent.name} onEdit={() => setUpdateAgentDialogOpen(true)} onRemove={handleRemoveAgent} />
            <div className="bg-white rounded-lg border">
                <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={agent.name}
                            className="size-10"
                        />
                        <h2 className="text-2xl font-medium">{agent.name}</h2>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                        <VideoIcon className="text-blue-700" />
                        {agent.meetingCount} {agent.meetingCount === 1 ? "Meeting" : "Meetings"}
                    </Badge>
                    <div className="flex flex-col gap-y-4">
                        <p className="text-lg font-medium">Instructions</p>
                        <p className="text-neutral-800">{agent.instructions}</p>
                    </div>
                </div>
            </div>
        </div>
    </>;
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