
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
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
import { candidateFormSchema, type CandidateFormValues } from "../../register/schema"
import { updateCandidate } from "./actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTransition } from "react"
import { Candidate } from "@/types/candidate"

interface EditCandidateFormProps {
    candidate: Candidate
}

export default function EditCandidateForm({ candidate }: EditCandidateFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<CandidateFormValues>({
        resolver: zodResolver(candidateFormSchema),
        defaultValues: {
            full_name: candidate.full_name,
            passport_no: candidate.passport_no,
            gender: (candidate.gender as "Male" | "Female" | "Other") || "Male",
            contact_number: candidate.contact_number || "",
            dob: candidate.dob || "",
            address: candidate.address || "",
            agent_id: candidate.agent_id || "",
        },
    })

    function onSubmit(data: CandidateFormValues) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value as string)
        })

        startTransition(async () => {
            const result = await updateCandidate(candidate.id, formData)

            if (result?.errors) {
                console.error("Server Validation Errors:", result.errors)
                alert(`Validation Failed: ${JSON.stringify(result.errors)}`)
                return
            }

            if (result?.error) {
                console.error("Database Error:", result.error)
                alert(`Error: ${result.message}\nDetails: ${result.error}`)
                return
            }
        })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Candidate</CardTitle>
                <CardDescription>Update the candidate's personal and passport details.</CardDescription>
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

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Updating...' : 'Update Candidate'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
