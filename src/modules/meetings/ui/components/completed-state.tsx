import Markdown from "react-markdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MeetingGetOne } from "../../types";
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";

interface CompletedStateProps {
    meeting: MeetingGetOne;
}

export const CompletedState = ({ meeting }: CompletedStateProps) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-background justify-start rounded-none h-13">
                            <TabsTrigger
                                value="summary"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <BookOpenTextIcon />
                                Summary
                            </TabsTrigger>
                            <TabsTrigger
                                value="transcript"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileTextIcon />
                                Transcript
                            </TabsTrigger>
                            <TabsTrigger
                                value="recording"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileVideoIcon />
                                Recording
                            </TabsTrigger>
                            <TabsTrigger
                                value="chat"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <SparklesIcon />
                                Chat
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <TabsContent value="recording">
                    <div className="bg-white rounded-lg border px-4 py-5">
                        <video
                            src={meeting.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>
                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize">
                                {meeting.name}
                            </h2>
                            <div className="flex gap-x-2 items-center">
                                <Link href={`/agents/${meeting.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar
                                        seed={meeting.agent.name}
                                        variant="botttsNeutral"
                                        className="size-5"
                                    />
                                    {meeting.agent.name}
                                </Link>{" "}
                                <p className="">
                                    {meeting.startedAt ? format(meeting.startedAt, "PPP") : ""}
                                </p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4" />
                                <p>General Summary</p>
                            </div>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-x-2 [&>svg]:size-4"
                            >
                                <ClockFadingIcon />
                                {meeting.duration ? formatDuration(meeting.duration) : "No duration"}
                            </Badge>
                            <div>
                                <Markdown
                                    components={{
                                        h1: (props) => <h1 className="text-2xl font-medium mb-6" {...props} />,
                                        h2: (props) => <h2 className="text-xl font-medium mb-4" {...props} />,
                                        h3: (props) => <h3 className="text-lg font-medium mb-3" {...props} />,
                                        h4: (props) => <h4 className="text-base font-medium mb-2" {...props} />,
                                        h5: (props) => <h5 className="text-sm font-medium mb-1" {...props} />,
                                        h6: (props) => <h6 className="text-xs font-medium mb-0" {...props} />,
                                        p: (props) => <p className="text-sm mb-4" {...props} />,
                                        ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
                                        ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
                                        li: (props) => <li className="mb-1" {...props} />,
                                        a: (props) => <a className="text-blue-500 underline" {...props} />,
                                        blockquote: (props) => <blockquote className="border-l-2 border-gray-300 pl-4 mb-4" {...props} />,
                                        code: (props) => <code className="bg-gray-100 px-1 py-0.5 rounded-md" {...props} />,
                                        pre: (props) => <pre className="bg-gray-100 p-4 rounded-md mb-4" {...props} />,
                                        img: (props) => <img className="mb-4" {...props} />,
                                        hr: (props) => <hr className="my-4" {...props} />,
                                        br: (props) => <br {...props} />,
                                        em: (props) => <em className="italic" {...props} />,
                                        strong: (props) => <strong className="font-bold" {...props} />,
                                        span: (props) => <span className="text-sm" {...props} />,
                                        div: (props) => <div className="mb-4" {...props} />,
                                        table: (props) => <table className="w-full mb-4" {...props} />,
                                        tr: (props) => <tr className="border-b" {...props} />,
                                        th: (props) => <th className="px-4 py-2 text-left" {...props} />,
                                        td: (props) => <td className="px-4 py-2" {...props} />,
                                        thead: (props) => <thead className="bg-gray-100" {...props} />,
                                        tbody: (props) => <tbody {...props} />,
                                        tfoot: (props) => <tfoot {...props} />,
                                        del: (props) => <del {...props} />,
                                        ins: (props) => <ins {...props} />,
                                        sub: (props) => <sub {...props} />,
                                        sup: (props) => <sup {...props} />,
                                        kbd: (props) => <kbd {...props} />,
                                        q: (props) => <q {...props} />,
                                        s: (props) => <s {...props} />,
                                        mark: (props) => <mark className="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded-md" {...props} />,
                                        small: (props) => <small className="text-xs" {...props} />,
                                        time: (props) => <time className="text-sm" {...props} />,
                                        details: (props) => <details className="mb-4" {...props} />,
                                        summary: (props) => <summary className="font-medium mb-2" {...props} />,
                                        dialog: (props) => <dialog className="mb-4" {...props} />,
                                        fieldset: (props) => <fieldset className="mb-4" {...props} />,
                                        label: (props) => <label className="block text-sm font-medium mb-1" {...props} />,
                                        input: (props) => <input className="w-full px-3 py-2 border rounded-md" {...props} />,
                                        textarea: (props) => <textarea className="w-full px-3 py-2 border rounded-md" {...props} />,
                                        select: (props) => <select className="w-full px-3 py-2 border rounded-md" {...props} />,
                                        button: (props) => <button className="px-4 py-2 bg-blue-500 text-white rounded-md" {...props} />,
                                        form: (props) => <form className="mb-4" {...props} />,
                                    }}
                                >
                                    {meeting.summary}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}