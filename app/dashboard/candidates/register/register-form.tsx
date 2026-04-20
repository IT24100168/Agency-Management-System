
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransition, useState, useRef } from "react"
import { Upload, X, User } from "lucide-react"

// ─── Static dropdown data ────────────────────────────────────────────────────

const SL_DISTRICTS = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
]

const SL_PROVINCES = [
    "Central", "Eastern", "North Central", "Northern",
    "North Western", "Sabaragamuwa", "Southern", "Uva", "Western",
]

const PRESET_COUNTRIES = [
    'Romania', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Dubai (UAE)',
    'Oman', 'Jordan', 'Bahrain', 'Lebanon', 'Malaysia',
]

// ─── Types ───────────────────────────────────────────────────────────────────
type SimpleAgent = { id: string; name: string }
interface RegisterFormProps { agents: SimpleAgent[] }

// ─── Reusable Select field ───────────────────────────────────────────────────
function SelectField({
    label, placeholder, options, field,
}: {
    label: string
    placeholder?: string
    options: string[]
    field: any
}) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder ?? `Select ${label}`} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {options.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    )
}

// ─── Main form ───────────────────────────────────────────────────────────────
export function RegisterForm({ agents }: RegisterFormProps) {
    const [isPending, startTransition] = useTransition()
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CandidateFormValues>({
        resolver: zodResolver(candidateFormSchema),
        defaultValues: {
            // General
            full_name: "",
            registration_number: "",
            registration_date: new Date().toISOString().split('T')[0],
            name_with_initials: "",
            nic: "",
            dob: "",
            age: undefined,
            gender: "",
            photo: "",
            // Personal
            home_town: "",
            place_of_birth: "",
            address: "",
            district: "",
            province: "",
            nationality: "Sri Lankan",
            religion: "",
            religion_other: "",
            marital_status: "",
            contact_number: "",
            secondary_contact_number: "",
            weight: undefined,
            height: undefined,
            children_count: undefined,
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
            passport_type: "",
            // Job
            job_country: "",
            job_category: "",
            job_category_other: "",
            job_post: "",
            job_salary: undefined,
            contract_period: "",
            experience: "",
            // Education
            education_level: "",
            education_other: "",
            english_proficiency: "",
            // Remarks
            remarks: "",
            agent_id: "",
        },
    })

    // Watch "Other" fields so UI reacts without re-render lag
    const religion        = useWatch({ control: form.control, name: "religion" })
    const jobCategory     = useWatch({ control: form.control, name: "job_category" })
    const jobCountry      = useWatch({ control: form.control, name: "job_country" })
    const educationLevel  = useWatch({ control: form.control, name: "education_level" })

    // Auto-calculate age when DOB changes
    const handleDobChange = (value: string, fieldOnChange: (v: string) => void) => {
        fieldOnChange(value)
        if (value) {
            const dob = new Date(value)
            const today = new Date()
            let age = today.getFullYear() - dob.getFullYear()
            const m = today.getMonth() - dob.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
            if (age >= 0 && age <= 120) form.setValue('age', age)
        }
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setPhotoPreview(URL.createObjectURL(file))
    }

    const clearPhoto = () => {
        setPhotoPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function onSubmit(data: CandidateFormValues) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, String(value))
            }
        })
        if (fileInputRef.current?.files?.[0]) {
            formData.append('photo_file', fileInputRef.current.files[0])
        }
        startTransition(async () => {
            const result = await createCandidate(formData)
            if (result?.errors) {
                console.error("Validation Errors:", result.errors)
                alert(`Validation Failed: ${JSON.stringify(result.errors)}`)
                return
            }
            if (result?.error) {
                console.error("Database Error:", result.error)
                alert(`Error: ${result.message}\nDetails: ${result.error}`)
            }
        })
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Register New Candidate</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* ── 1. General Details ─────────────────────────────── */}
                    <Card>
                        <CardHeader><CardTitle>1. General Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">

                            {/* Photo Upload */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                    {photoPreview
                                        ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        : <User className="w-12 h-12 text-gray-400" />}
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
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
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

                                {/* DOB with auto-age calculation */}
                                <FormField control={form.control} name="dob" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                value={field.value ?? ""}
                                                onChange={(e) => handleDobChange(e.target.value, field.onChange)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Age – auto-filled */}
                                <FormField control={form.control} name="age" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age (auto-filled)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value ?? ""}
                                                className="bg-muted cursor-not-allowed"
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Gender */}
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <SelectField label="Gender" options={["Male", "Female", "Other"]} field={field} />
                                )} />

                                {/* Marital Status */}
                                <FormField control={form.control} name="marital_status" render={({ field }) => (
                                    <SelectField
                                        label="Marital Status"
                                        options={["Single", "Married", "Divorced", "Widowed"]}
                                        field={field}
                                    />
                                )} />

                                {/* Religion + Other */}
                                <FormField control={form.control} name="religion" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Religion</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Religion" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {["Buddhist", "Hindu", "Muslim", "Catholic", "Christian"].map(o => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                                <SelectItem value="Other">Other (enter manually)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {religion === "Other" && (
                                    <FormField control={form.control} name="religion_other" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Religion (specify)</FormLabel>
                                            <FormControl><Input {...field} placeholder="Enter religion" autoFocus /></FormControl>
                                        </FormItem>
                                    )} />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Assigned Agent ─────────────────────────────────── */}
                    <Card>
                        <CardHeader><CardTitle>Assigned Agent</CardTitle></CardHeader>
                        <CardContent>
                            <div className="md:w-1/2">
                                <FormField control={form.control} name="agent_id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agent</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Agent" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {agents.map((agent) => (
                                                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
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

                    {/* ── 2. Personal Details ────────────────────────────── */}
                    <Card>
                        <CardHeader><CardTitle>2. Personal Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField control={form.control} name="contact_number" render={({ field }) => (
                                    <FormItem><FormLabel>Mobile Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="secondary_contact_number" render={({ field }) => (
                                    <FormItem><FormLabel>Secondary Contact</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="nationality" render={({ field }) => (
                                    <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="home_town" render={({ field }) => (
                                    <FormItem><FormLabel>Home Town</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="place_of_birth" render={({ field }) => (
                                    <FormItem><FormLabel>Place of Birth</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />

                                {/* District */}
                                <FormField control={form.control} name="district" render={({ field }) => (
                                    <SelectField label="District" options={SL_DISTRICTS} field={field} />
                                )} />

                                {/* Province */}
                                <FormField control={form.control} name="province" render={({ field }) => (
                                    <SelectField label="Province" options={SL_PROVINCES} field={field} />
                                )} />

                                <FormField control={form.control} name="weight" render={({ field }) => (
                                    <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ""} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ""} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="children_count" render={({ field }) => (
                                    <FormItem><FormLabel>No. of Children</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl></FormItem>
                                )} />
                            </div>

                            {/* Home Address – full width */}
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Home Address</FormLabel>
                                    <FormControl><Textarea className="min-h-[80px]" placeholder="Full home address…" {...field} /></FormControl>
                                </FormItem>
                            )} />

                            {/* Guardian Details */}
                            <div className="border-t pt-4 mt-2">
                                <h4 className="text-sm font-semibold mb-3">Guardian / Next-of-Kin Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="guardian_name" render={({ field }) => (
                                        <FormItem><FormLabel>Guardian Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />

                                    {/* Relationship dropdown */}
                                    <FormField control={form.control} name="guardian_relationship" render={({ field }) => (
                                        <SelectField
                                            label="Relationship to Guardian"
                                            options={["Father", "Mother", "Spouse", "Brother", "Sister", "Son", "Daughter"]}
                                            field={field}
                                        />
                                    )} />

                                    <FormField control={form.control} name="guardian_contact" render={({ field }) => (
                                        <FormItem><FormLabel>Guardian Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="guardian_address" render={({ field }) => (
                                        <FormItem className="md:col-span-2 lg:col-span-3">
                                            <FormLabel>Guardian Address</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── 3. Passport Details ────────────────────────────── */}
                    <Card>
                        <CardHeader><CardTitle>3. Passport Details</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField control={form.control} name="passport_no" render={({ field }) => (
                                    <FormItem><FormLabel>Passport Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="passport_issued_date" render={({ field }) => (
                                    <FormItem><FormLabel>Issued Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="passport_exp_date" render={({ field }) => (
                                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                                )} />

                                {/* Issue Office */}
                                <FormField control={form.control} name="passport_place_issued" render={({ field }) => (
                                    <SelectField
                                        label="Issue Office"
                                        options={["Colombo", "Kandy", "Kurunegala", "Matara", "Vavuniya", "Batticaloa"]}
                                        field={field}
                                    />
                                )} />

                                {/* Passport Status */}
                                <FormField control={form.control} name="passport_status" render={({ field }) => (
                                    <SelectField
                                        label="Passport Status"
                                        options={["In Custody", "With Candidate", "At Embassy", "Expired", "To be Renewed"]}
                                        field={field}
                                    />
                                )} />

                                {/* Passport Type */}
                                <FormField control={form.control} name="passport_type" render={({ field }) => (
                                    <SelectField
                                        label="Passport Type"
                                        options={["Ordinary", "Official", "Diplomatic"]}
                                        field={field}
                                    />
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── 4. Job Details ─────────────────────────────────── */}
                    <Card>
                        <CardHeader><CardTitle>4. Job Details</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Destination Country with Other */}
                                <FormField control={form.control} name="job_country" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination Country</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(val)}
                                            value={PRESET_COUNTRIES.includes(field.value ?? "") ? (field.value ?? "") : (field.value ? "Other" : "")}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Country" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PRESET_COUNTRIES.map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                                <SelectItem value="Other">Other (enter manually)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {(jobCountry === "Other" || (jobCountry && !PRESET_COUNTRIES.includes(jobCountry))) && (
                                            <Input
                                                className="mt-2"
                                                placeholder="Enter country manually"
                                                defaultValue={!PRESET_COUNTRIES.includes(jobCountry ?? "") ? jobCountry : ""}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                autoFocus
                                            />
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Job Category + Other */}
                                <FormField control={form.control} name="job_category" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Job Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[
                                                    "Housemaid", "Driver (Light)", "Driver (Heavy)",
                                                    "Construction Worker", "Nurse", "Security Officer",
                                                    "Hotel Staff", "MEP Technician",
                                                ].map(o => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                                <SelectItem value="Other">Other (enter manually)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {jobCategory === "Other" && (
                                    <FormField control={form.control} name="job_category_other" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Category (specify)</FormLabel>
                                            <FormControl><Input {...field} placeholder="Enter job category" autoFocus /></FormControl>
                                        </FormItem>
                                    )} />
                                )}

                                {/* Experience Level */}
                                <FormField control={form.control} name="experience" render={({ field }) => (
                                    <SelectField
                                        label="Experience Level"
                                        options={["Newbie", "1-2 Years", "3-5 Years", "5+ Years", "Ex-Gulf (Returnee)"]}
                                        field={field}
                                    />
                                )} />

                                {/* Contract Period */}
                                <FormField control={form.control} name="contract_period" render={({ field }) => (
                                    <SelectField
                                        label="Contract Period"
                                        options={["6 Months", "1 Year", "2 Years", "3 Years", "4 Years", "5 Years"]}
                                        field={field}
                                    />
                                )} />

                                <FormField control={form.control} name="job_post" render={({ field }) => (
                                    <FormItem><FormLabel>Job Title / Post</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="job_salary" render={({ field }) => (
                                    <FormItem><FormLabel>Salary (USD / Month)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl></FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── 5. Education & Language Skills ─────────────────── */}
                    <Card>
                        <CardHeader><CardTitle>5. Education &amp; Language Skills</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Highest Education + Other */}
                                <FormField control={form.control} name="education_level" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Highest Education</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Education Level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[
                                                    "Grade 8", "O/L", "A/L",
                                                    "Diploma", "Degree",
                                                    "Vocational Training (NVQ)",
                                                ].map(o => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                                <SelectItem value="Other">Other (enter manually)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {educationLevel === "Other" && (
                                    <FormField control={form.control} name="education_other" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Education (specify)</FormLabel>
                                            <FormControl><Input {...field} placeholder="Enter education level" autoFocus /></FormControl>
                                        </FormItem>
                                    )} />
                                )}

                                {/* English Proficiency */}
                                <FormField control={form.control} name="english_proficiency" render={({ field }) => (
                                    <SelectField
                                        label="English Proficiency"
                                        options={["None", "Basic", "Fair", "Fluent"]}
                                        field={field}
                                    />
                                )} />
                            </div>

                            {/* Remarks */}
                            <div className="mt-4">
                                <FormField control={form.control} name="remarks" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Remarks / Additional Notes</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-[100px]" placeholder="Any extra notes…" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
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
