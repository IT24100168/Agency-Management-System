
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
import { Textarea } from "@/components/ui/textarea"
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
import { useTransition, useState, useRef } from "react"
import { Upload, X, User } from "lucide-react"

// Define simplified Agent type locally to avoid importing from @prisma/client directly in client component if types aren't set up
type SimpleAgent = {
    id: string
    name: string
}

interface RegisterFormProps {
    agents: SimpleAgent[]
}

export function RegisterForm({ agents }: RegisterFormProps) {
    const [isPending, startTransition] = useTransition()
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm({
        resolver: zodResolver(candidateFormSchema),
        defaultValues: {
            // General
            full_name: "",
            registration_number: "",
            registration_date: new Date().toISOString().split('T')[0], // Default to today
            name_with_initials: "",
            nic: "",
            dob: "",
            age: "",
            gender: "Male",
            photo: "",
            // Personal
            home_town: "",
            place_of_birth: "",
            gs_section: "",
            police_area: "",
            aga_division: "",
            nationality: "",
            religion: "",
            marital_status: "",
            contact_number: "",
            secondary_contact_number: "",
            address: "",
            weight: "",
            height: "",
            children_count: "",
            // Guardian
            guardian_name: "",
            guardian_address: "",
            guardian_relationship: "",
            guardian_contact: "",
            // Passport
            passport_no: "",
            passport_issued_date: "",
            passport_exp_date: "",
            passport_place_issued: "",
            passport_status: "",
            // Job
            job_country: "",
            job_post: "",
            job_salary: "",
            contract_period: "",
            experience: "",
            // Remarks
            remarks: "",
            // Agent
            agent_id: "",
        },
    })

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPhotoPreview(url)
        }
    }

    const clearPhoto = () => {
        setPhotoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    function onSubmit(data: CandidateFormValues) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value))
            }
        })

        if (fileInputRef.current?.files?.[0]) {
            formData.append('photo_file', fileInputRef.current.files[0])
        }

        startTransition(async () => {
            const result = await createCandidate(formData)

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
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Register New Candidate</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* 1. General Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. General Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Photo Upload */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="w-4 h-4 mr-2" /> Upload Photo
                                        </Button>
                                        {photoPreview && (
                                            <Button type="button" variant="destructive" size="icon" onClick={clearPhoto}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField control={form.control} name="registration_number" render={({ field }) => (
                                    <FormItem><FormLabel>Registration Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="registration_date" render={({ field }) => (
                                    <FormItem><FormLabel>Registration Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="full_name" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="name_with_initials" render={({ field }) => (
                                    <FormItem><FormLabel>Name with Initials</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nic" render={({ field }) => (
                                    <FormItem><FormLabel>NIC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="dob" render={({ field }) => (
                                    <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="age" render={({ field }) => (
                                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} value={field.value as any} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem><FormLabel>Sex</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                        </Select>
                                        <FormMessage /></FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agent Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Agent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="md:w-1/2">
                                <FormField control={form.control} name="agent_id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agent</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Agent" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {agents.map((agent) => (
                                                    <SelectItem key={agent.id} value={agent.id}>
                                                        {agent.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Select the agent handling this candidate.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>


                    {/* 2. Personal Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField control={form.control} name="home_town" render={({ field }) => (
                                    <FormItem><FormLabel>Home Town</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="place_of_birth" render={({ field }) => (
                                    <FormItem><FormLabel>Place of Birth</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="gs_section" render={({ field }) => (
                                    <FormItem><FormLabel>GS Section</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="police_area" render={({ field }) => (
                                    <FormItem><FormLabel>Police Area</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="aga_division" render={({ field }) => (
                                    <FormItem><FormLabel>AGA Division</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="nationality" render={({ field }) => (
                                    <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="religion" render={({ field }) => (
                                    <FormItem><FormLabel>Religion</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="marital_status" render={({ field }) => (
                                    <FormItem><FormLabel>Marital Status</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="contact_number" render={({ field }) => (
                                    <FormItem><FormLabel>Mobile Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="secondary_contact_number" render={({ field }) => (
                                    <FormItem><FormLabel>Secondary Contact</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="weight" render={({ field }) => (
                                    <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value as any} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem><FormLabel>Height (cm/ft)</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value as any} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="children_count" render={({ field }) => (
                                    <FormItem><FormLabel>Children</FormLabel><FormControl><Input type="number" {...field} value={field.value as any} /></FormControl></FormItem>
                                )} />
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <h4 className="text-sm font-semibold mb-3">Guardian Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="guardian_name" render={({ field }) => (
                                        <FormItem><FormLabel>Guardian Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="guardian_address" render={({ field }) => (
                                        <FormItem><FormLabel>Guardian Address</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="guardian_relationship" render={({ field }) => (
                                        <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="guardian_contact" render={({ field }) => (
                                        <FormItem><FormLabel>Guardian Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Passport Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Passport Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField control={form.control} name="passport_no" render={({ field }) => (
                                    <FormItem><FormLabel>Passport Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="passport_issued_date" render={({ field }) => (
                                    <FormItem><FormLabel>Issued Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="passport_exp_date" render={({ field }) => (
                                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="passport_place_issued" render={({ field }) => (
                                    <FormItem><FormLabel>Place Issued</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="passport_status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passport Available?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="In Custody">In Custody</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Job Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>4. Job Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField control={form.control} name="job_country" render={({ field }) => (
                                    <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="job_post" render={({ field }) => (
                                    <FormItem><FormLabel>Post Applied</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="job_salary" render={({ field }) => (
                                    <FormItem><FormLabel>Salary</FormLabel><FormControl><Input type="number" {...field} value={field.value as any} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="contract_period" render={({ field }) => (
                                    <FormItem><FormLabel>Contract</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="experience" render={({ field }) => (
                                    <FormItem><FormLabel>Experience</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. Education & Remarks */}
                    <Card>
                        <CardHeader>
                            <CardTitle>5. Education & Other Remarks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField control={form.control} name="remarks" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Education / Remarks</FormLabel>
                                    <FormControl><Textarea className="min-h-[100px]" placeholder="Enter education details or any other remarks..." {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" disabled={isPending} className="w-full">
                        {isPending ? 'Registering...' : 'Register Candidate'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
