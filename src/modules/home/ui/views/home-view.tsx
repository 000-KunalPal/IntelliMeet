"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { redirect, useRouter } from "next/navigation"

export const HomeView = () => {
    const { data: session, isPending } = authClient.useSession()
    const router = useRouter()

    if (isPending) {
        return <p>Loading session...</p>;
    }

    if (!session) {
        return redirect("/");
    }

    const handleSignOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/sign-in")
            }
        })
    }

    return (
        <div>
            <h1>Logged in as {session.user.name}</h1>
            <Button onClick={handleSignOut}>Sign out</Button>
        </div>
    )
}