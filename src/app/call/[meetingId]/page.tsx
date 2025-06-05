import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { CallView } from "@/modules/call/ui/views/call-view";

interface CallPageProps {
    params: Promise<{ meetingId: string }>
}

const CallPage = async ({ params }: CallPageProps) => {
    const { meetingId } = await params;

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/sign-in")
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId
        })
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Loading...</div>}>
                <ErrorBoundary fallback={<div>Error...</div>}>
                    <CallView meetingId={meetingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default CallPage;