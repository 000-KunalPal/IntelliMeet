"use client";

import { StreamVideo, Call, CallingState, StreamCall, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";

import "@stream-io/video-styling/dist/css/styles.css";
import { CallUI } from "./call-ui";

interface CallConnectProps {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: CallConnectProps) => {
    const trpc = useTRPC();
    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions()
    )

    const [client, setClient] = useState<StreamVideoClient>();

    useEffect(() => {
        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage
            },
            tokenProvider: generateToken
        })

        setClient(_client);

        return () => {
            _client.disconnectUser();
            setClient(undefined);
        }
    }, [generateToken, userId, userName, userImage])

    const [call, setCall] = useState<Call>();

    useEffect(() => {
        if (!client) return;

        const _call = client.call("default", meetingId)
        _call.camera.disable();
        _call.microphone.disable();
        setCall(_call);

        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {
                _call.leave();
                _call.endCall()
                setCall(undefined);
            }
        }
    }, [client, meetingId])

    if (!client || !call) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="animate-spin size-6 text-white" />
            </div>
        )
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call} >
                <CallUI meetingName={meetingName} />
            </StreamCall>
        </StreamVideo>
    )
}