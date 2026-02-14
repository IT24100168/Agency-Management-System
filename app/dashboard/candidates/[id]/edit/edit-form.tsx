
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
import { Textarea } from "@/components/ui/textarea"
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
import { useTransition, useState, useRef } from "react"
import { Candidate } from "@/types/candidate"
import { Upload, X, User } from "lucide-react"

interface EditCandidateFormProps {
    candidate: Candidate
}

export default function EditCandidateForm({ candidate }: EditCandidateFormProps) {
    const [isPending, startTransition] = useTransition()
    const [photoPreview, setPhotoPreview] = useState<string | null>(candidate.photo || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm({
        resolver: zodResolver(candidateFormSchema),
        defaultValues: {
            // General
            full_name: candidate.full_name,
            registration_number: candidate.registration_number ?? "",
            name_with_initials: candidate.name_with_initials ?? "",
            nic: candidate.nic ?? "",
            dob: candidate.dob ? candidate.dob.split('T')[0] : "",
            age: candidate.age ?? "",
            gender: candidate.gender ?? "Male",
            photo: candidate.photo ?? "",

            // Personal
            home_town: candidate.home_town ?? "",
            place_of_birth: candidate.place_of_birth ?? "",
            gs_section: candidate.gs_section ?? "",
            police_area: candidate.police_area ?? "",
            aga_division: candidate.aga_division ?? "",
            nationality: candidate.nationality ?? "",
            religion: candidate.religion ?? "",
            marital_status: candidate.marital_status ?? "",
            contact_number: candidate.contact_number ?? "",
            secondary_contact_number: candidate.secondary_contact_number ?? "",
            address: candidate.address ?? "",
            weight: candidate.weight ?? "",
            height: candidate.height ?? "",
            children_count: candidate.children_count ?? "",

            // Guardian
            guardian_name: candidate.guardian_name ?? "",
            guardian_address: candidate.guardian_address ?? "",
            guardian_relationship: candidate.guardian_relationship ?? "",
            guardian_contact: candidate.guardian_contact ?? "",

            // Passport
            passport_no: candidate.passport_no ?? "",
            passport_issued_date: candidate.passport_issued_date ? candidate.passport_issued_date.split('T')[0] : "",
            passport_exp_date: candidate.passport_exp_date ? candidate.passport_exp_date.split('T')[0] : "",
            passport_place_issued: candidate.passport_place_issued ?? "",

            // Job
            job_country: candidate.job_country ?? "",
            job_post: candidate.job_post ?? "",
            job_salary: candidate.job_salary ?? "",
            contract_period: candidate.contract_period ?? "",
            experience: candidate.experience ?? "",

            // Remarks
            remarks: candidate.remarks ?? "",

            // Hidden/Preserved
            agent_id: candidate.agent_id ?? "",
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

            // Optionally redirect or show success toast
            alert("Candidate updated successfully!")
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error("Form Validation Errors:", errors);
                alert("Please check the form for errors. Fields marked with * are required.");
            })} className="space-y-6">

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
                    {isPending ? 'Updating...' : 'Update Candidate'}
                </Button>
            </form>
        </Form>
    )
}
