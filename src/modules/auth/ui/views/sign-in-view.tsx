"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { OctagonAlertIcon, Loader2 } from "lucide-react"
import { FaGoogle } from "react-icons/fa"

import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { authClient } from "@/lib/auth-client"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export const SignInView = () => {
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [isGooglePending, setIsGooglePending] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null)
        setIsPending(true)


        authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: "/"
        }, {
            onSuccess: () => {
                setIsPending(false)
                router.push("/")
            },
            onError: ({ error }) => {
                setError(error.message)
            }
        })
    }

    const onSocialSubmit = (provider: "google") => {
        setError(null)
        setIsGooglePending(true)

        authClient.signIn.social({
            provider,
            callbackURL: "/"
        }, {
            onSuccess: () => {
                setIsGooglePending(false)
            },
            onError: ({ error }) => {
                setError(error.message)
            }
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome Back!
                                    </h1>
                                    <p className="text-balance text-muted-foreground">
                                        Sign in to your account to continue
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="m@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <Button disabled={isPending || isGooglePending} type="submit" className="w-full">
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
                                </div>
                                <div>
                                    <Button onClick={() => onSocialSubmit("google")} variant="outline" type="button" className="w-full" disabled={isGooglePending || isPending}>
                                        {isGooglePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FaGoogle className="mr-2" />}
                                        Google
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account? <Link href="/sign-up" className="underline underline-offset-4">Sign up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-radial from-[#7258b4] to-[#6a6ed3] relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src='/logo.svg' alt="Image" className="h-92 w-92" />
                        <p className="text-2xl font-semibold text-white">
                            IntelliMeet
                        </p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-sm text-balance *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link href="/terms" className="underline underline-offset-4">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
            </div>
        </div>
    )
}