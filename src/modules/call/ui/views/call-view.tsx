"use client";

import { ErrorState } from "@/components/error-state";
import { CallProvider } from "../components/call-provider";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface CallViewProps {
    meetingId: string
}

export const CallView = ({ meetingId }: CallViewProps) => {
    const trpc = useTRPC();
    const { data: meeting } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

    if (meeting.status === "completed") {
        return (
            <div className="flex h-screen items-center justify-center">
                <ErrorState title="Meeting Completed" description="The meeting has already completed." />
            </div>
        )
    }

    return (
        <CallProvider meetingId={meetingId} meetingName={meeting.name} />
    )

}
