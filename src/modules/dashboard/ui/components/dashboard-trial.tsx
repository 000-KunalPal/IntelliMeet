import Link from "next/link"
import { RocketIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"


import { Button } from "@/components/ui/button"

import { MAX_FREE_MEETINGS, MAX_FREE_AGENTS } from "@/modules/premium/constants"
import { useTRPC } from "@/trpc/client"
import { Progress } from "@/components/ui/progress"

export const DashboardTrial = () => {
    const trpc = useTRPC()
    const { data: freeUsage } = useQuery(trpc.premium.getFreeUsage.queryOptions())

    if (!freeUsage) return null

    return (
        <div className="border border-border/10 rounded-lg w-full bg-white/5 flex flex-col gap-y-2">
            <div className="p-3 flex flex-col gap-y-4">
                <div className="flex items-center gap-2">
                    <RocketIcon className="size-4" />
                    <p className="text-sm font-medium">
                        Free Trial
                    </p>
                </div>
                <div className="flex flex-col gap-y-2">
                    <p className="text-xs">
                        {freeUsage.agentCount} / {MAX_FREE_AGENTS} Agents
                    </p>
                    <Progress value={(freeUsage.agentCount / MAX_FREE_AGENTS) * 100} />
                </div>
                <div className="flex flex-col gap-y-2">
                    <p className="text-xs">
                        {freeUsage.meetingCount} / {MAX_FREE_MEETINGS} Meetings
                    </p>
                    <Progress value={(freeUsage.meetingCount / MAX_FREE_MEETINGS) * 100} />
                </div>
            </div>
            <Button className="bg-transparent border-t border-border/10 hover:bg-white/10 rounded-t-none" asChild>
                <Link href="/upgrade">
                    Upgrade
                </Link>
            </Button>
        </div>
    )
}