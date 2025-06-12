import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer"
import { GeneratedAvatar } from "@/components/generated-avatar";
import { ChevronDown, ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const isMobile = useIsMobile();

    const handleLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                }
            }
        });
    }

    if (isPending || !session?.user) {
        return null
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex
            items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                    {session.user.image ? (
                        <Avatar>
                            <AvatarImage src={session.user.image} />
                        </Avatar>
                    ) :
                        <GeneratedAvatar
                            seed={session.user.name}
                            variant="initials"
                            className="size-9 mr-3"
                        />
                    }
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">
                            {session.user.name}
                        </p>
                        <p className="text-sm truncate w-full">
                            {session.user.email}
                        </p>
                    </div>
                    <ChevronDown className="size-4 shrink-0" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{session.user.name}</DrawerTitle>
                        <DrawerDescription>{session.user.email}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button
                            variant="outline"
                            onClick={() => authClient.customer.portal()}
                        >
                            <CreditCardIcon className="size-4 text-black" />
                            Billing
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                        >
                            <LogOutIcon className="size-4 text-black" />
                            Logout
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                {session.user.image ? (
                    <Avatar>
                        <AvatarImage src={session.user.image} />
                    </Avatar>
                ) : (
                    <GeneratedAvatar seed={session.user.name} variant="initials" className="size-9 mr-3" />
                )}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">{session.user.name}</p>
                    <p className="text-xs truncate w-full">{session.user.email}</p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1"></div>
                    <p className="truncate font-medium">{session.user.name}</p>
                    <p className="text-sm font-normal truncate text-muted-foreground">{session.user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => authClient.customer.portal()} className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center justify-between">
                    Log out
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}