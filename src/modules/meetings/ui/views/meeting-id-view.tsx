"use client"

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MeetingIdViewHeader } from "@/modules/meetings/ui/components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "@/modules/meetings/ui/components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "@/modules/meetings/ui/components/upcoming-state";
import { ActiveState } from "@/modules/meetings/ui/components/active-state";
import { CancelledState } from "@/modules/meetings/ui/components/cancelled-state";
import { ProcessingState } from "@/modules/meetings/ui/components/processing-state";

interface MeetingIdViewProps {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false)

    const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
        "Are you sure you want to delete this meeting?",
        `The following action will remove the meeting and all associated data.`
    )

    const { data: meeting } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    )

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
                // TODO: Invalidate free tier usage
                router.push("/meetings")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const handleRemoveMeeting = async () => {
        const confirmed = await confirmRemove()
        if (!confirmed) return

        await removeMeeting.mutateAsync({ id: meetingId })
    }

    const isActive = meeting.status === "active"
    const isUpcoming = meeting.status === "upcoming"
    const isCancelled = meeting.status === "cancelled"
    const isCompleted = meeting.status === "completed"
    const isProcessing = meeting.status === "processing"

    return <>
        <RemoveConfirmationDialog />
        <UpdateMeetingDialog
            open={updateMeetingDialogOpen}
            onOpenChange={setUpdateMeetingDialogOpen}
            initialValues={meeting}
        />
        <div className="flex flex-col flex-1 py-4 px-4 md:px-8 gap-y-4">
            <MeetingIdViewHeader meetingId={meetingId} meetingName={meeting.name} onEdit={() => setUpdateMeetingDialogOpen(true)} onRemove={handleRemoveMeeting} />
            {isCancelled && (
                <CancelledState />
            )}
            {isCompleted && (
                <div>Meeting Completed</div>
            )}
            {isProcessing && (
                <ProcessingState />
            )}
            {isActive && (
                <ActiveState meetingId={meetingId} />
            )}
            {isUpcoming && (
                <UpcomingState meetingId={meetingId} onCancelMeeting={() => { }} isCancelling={false} />
            )}
        </div>
    </>;
};

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState title="Loading meeting..." description="Please wait while we load the meeting." />
    )
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState title="Error loading meeting" description="Please try again later." />
    )
} 