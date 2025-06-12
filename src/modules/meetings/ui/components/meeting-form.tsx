import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MeetingGetOne } from "../../types";
import { meetingsInsertSchema } from "../../schemas";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useRouter } from "next/navigation";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {
    const trpc = useTRPC();
    const router = useRouter()
    const queryClient = useQueryClient()

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false)
    const [agentSearch, setAgentSearch] = useState("")

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    )

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (meeting) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                )
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions()
                )

                onSuccess?.(meeting.id)
            },
            onError: (error) => {
                toast.error(error.message)

                if (error.data?.code === "FORBIDDEN") {
                    router.push("/upgrade")
                }
            }
        })
    )

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                )

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id })
                    )
                }

                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? ""
        }
    })

    const isEdit = !!initialValues?.id
    const isPending = createMeeting.isPending || updateMeeting.isPending

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({ ...values, id: initialValues.id })
        } else {
            createMeeting.mutate(values)
        }
    }

    return (
        <>
            <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. 'Math consultation'" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="agentId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agent</FormLabel>
                                <FormControl>
                                    <CommandSelect
                                        options={(agents.data?.items ?? []).map((agent) => ({
                                            id: agent.id,
                                            value: agent.id,
                                            children: (
                                                <div className="flex items-center gap-x-2">
                                                    <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="border size-6" />
                                                    <span>{agent.name}</span>
                                                </div>
                                            )
                                        }))}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        value={field.value}
                                        placeholder="Select an agent"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Not found what you&apos;re looking for?{" "}
                                    <button className="text-primary hover:underline" onClick={() => setOpenNewAgentDialog(true)}>
                                        Create new agent
                                    </button>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-x-2 justify-between">
                        {onCancel && (
                            <Button variant="ghost" type="button" disabled={isPending} onClick={() => onCancel()}>Cancel</Button>
                        )}
                        <Button type="submit" disabled={isPending}>
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}