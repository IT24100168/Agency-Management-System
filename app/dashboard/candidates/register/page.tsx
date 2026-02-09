
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { candidateFormSchema, type CandidateFormValues } from "./schema"
import { createCandidate } from "./actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTransition } from "react"
// import { toast } from "@/components/ui/use-toast" // assuming toast is installed or will be

export default function RegisterCandidatePage() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<CandidateFormValues>({
        resolver: zodResolver(candidateFormSchema),
        defaultValues: {
            full_name: "",
            passport_no: "",
            gender: "Male",
            contact_number: "",
        },
    })

    function onSubmit(data: CandidateFormValues) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string)
        })

        startTransition(async () => {
            const result = await createCandidate(formData)

            if (result?.errors) {
                // Handle Zod validation errors from server
                console.error("Server Validation Errors:", result.errors)
                // You could map these to form.setError if you wanted, for now just alerting
                alert(`Validation Failed: ${JSON.stringify(result.errors)}`)
                return
            }

            if (result?.error) {
                // Handle Database errors
                console.error("Database Error:", result.error)
                alert(`Error: ${result.message}\nDetails: ${result.error}`)
                return
            }
        })
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Register New Candidate</h2>
            </div>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Candidate Information</CardTitle>
                    <CardDescription>Enter the candidate's personal and passport details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="passport_no"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Passport Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="A1234567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                                {/* Using native date input for simplicity now, can upgrade to Calendar */}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="contact_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Registering...' : 'Register Candidate'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
