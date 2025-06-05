"use client"

import { LoaderIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { CallConnect } from "./call-connect";

interface CallProviderProps {
    meetingId: string;
    meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: CallProviderProps) => {
    const { data: session, isPending } = authClient.useSession();

    if (!session || isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="animate-spin size-6 text-white" />
            </div>
        )
    }

    return (
        <CallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={session.user.id}
            userName={session.user.name}
            userImage={session.user.image ?? generateAvatarUri({
                seed: session.user.name,
                variant: "initials"
            })}
        />
    )
}