import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candidate } from "@/types/candidate"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

import { AgentAssignment } from "../components/agent-assignment"
import { Agent } from "@/types/agent"

export function CandidateInfo({ candidate, agents }: { candidate: Candidate, agents: Agent[] }) {

    // Status color mapping
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Registered": return "bg-blue-500 hover:bg-blue-600";
            case "Medical": return "bg-yellow-500 hover:bg-yellow-600";
            case "Visa": return "bg-purple-500 hover:bg-purple-600";
            case "Completed": return "bg-green-500 hover:bg-green-600";
            default: return "bg-slate-500";
        }
    }

    return (
        <div className="space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-32 h-32 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    {candidate.photo ? (
                        <img src={candidate.photo} alt={candidate.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-12 h-12 text-gray-400" />
                    )}
                </div>
                <div className="space-y-2 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{candidate.full_name}</h2>
                            <p className="text-muted-foreground">{candidate.name_with_initials}</p>
                        </div>
                        <Badge className={`${getStatusColor(candidate.status)} text-base px-4 py-1`}>
                            {candidate.status}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                        <div className="bg-muted/50 p-2 rounded text-sm">
                            <span className="block text-muted-foreground text-xs uppercase font-semibold">Reg No</span>
                            <span className="font-mono font-medium">{candidate.registration_number || "-"}</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded text-sm">
                            <span className="block text-muted-foreground text-xs uppercase font-semibold">Passport No</span>
                            <span className="font-mono font-medium">{candidate.passport_no}</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded text-sm">
                            <span className="block text-muted-foreground text-xs uppercase font-semibold">NIC</span>
                            <span className="font-mono font-medium">{candidate.nic || "-"}</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded text-sm">
                            <span className="block text-muted-foreground text-xs uppercase font-semibold">Gender</span>
                            <span className="font-medium">{candidate.gender || "-"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* Personal Details */}
                <Card>
                    <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-sm font-medium text-muted-foreground">Date of Birth</span><div className="text-sm">{candidate.dob ? new Date(candidate.dob).toLocaleDateString() : '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Age</span><div className="text-sm">{candidate.age || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Marital Status</span><div className="text-sm">{candidate.marital_status || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Religion</span><div className="text-sm">{candidate.religion || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Nationality</span><div className="text-sm">{candidate.nationality || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Children</span><div className="text-sm">{candidate.children_count || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Height</span><div className="text-sm">{candidate.height ? `${candidate.height} cm` : '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Weight</span><div className="text-sm">{candidate.weight ? `${candidate.weight} kg` : '-'}</div></div>
                        </div>
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-1 gap-2">
                                <div><span className="text-sm font-medium text-muted-foreground">Home Town</span><div className="text-sm">{candidate.home_town || '-'}</div></div>
                                <div><span className="text-sm font-medium text-muted-foreground">Birth Place</span><div className="text-sm">{candidate.place_of_birth || '-'}</div></div>
                                <div><span className="text-sm font-medium text-muted-foreground">Current Address</span><div className="text-sm">{candidate.address || '-'}</div></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact & Guardian */}
                <Card>
                    <CardHeader><CardTitle>Contact & Guardian</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-sm font-medium text-muted-foreground">Mobile</span><div className="text-sm font-mono">{candidate.contact_number || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Secondary</span><div className="text-sm font-mono">{candidate.secondary_contact_number || '-'}</div></div>
                        </div>
                        <div className="border-t pt-4 mt-2">
                            <h4 className="text-sm font-semibold mb-2">Guardian Info</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="text-sm font-medium text-muted-foreground">Name</span><div className="text-sm">{candidate.guardian_name || '-'}</div></div>
                                <div><span className="text-sm font-medium text-muted-foreground">Relation</span><div className="text-sm">{candidate.guardian_relationship || '-'}</div></div>
                                <div className="col-span-2"><span className="text-sm font-medium text-muted-foreground">Address</span><div className="text-sm">{candidate.guardian_address || '-'}</div></div>
                                <div><span className="text-sm font-medium text-muted-foreground">Phone</span><div className="text-sm">{candidate.guardian_contact || '-'}</div></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Passport & Job */}
                <Card>
                    <CardHeader><CardTitle>Passport & Job Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-sm font-medium text-muted-foreground">Passport No</span><div className="text-sm font-mono">{candidate.passport_no}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Place Issued</span><div className="text-sm">{candidate.passport_place_issued || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Issued Date</span><div className="text-sm">{candidate.passport_issued_date ? new Date(candidate.passport_issued_date).toLocaleDateString() : '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Expiry Date</span><div className="text-sm">{candidate.passport_exp_date ? new Date(candidate.passport_exp_date).toLocaleDateString() : '-'}</div></div>
                        </div>
                        <div className="border-t pt-4 mt-2">
                            <h4 className="text-sm font-semibold mb-2">Job Application</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="text-sm font-medium text-muted-foreground">Country</span><div className="text-sm">{candidate.job_country || '-'}</div></div>
                                <div><span className="text-sm font-medium text-muted-foreground">Post</span><div className="text-sm">{candidate.job_post || '-'}</div></div>
                                <div><span className="text-sm font-medium text-muted-foreground">Salary</span><div className="text-sm">{candidate.job_salary ? `Rs. ${candidate.job_salary}` : '-'}</div></div>
                                <div><span className="text-sm font-medium text-muted-foreground">Contract</span><div className="text-sm">{candidate.contract_period || '-'}</div></div>
                                <div className="col-span-2"><span className="text-sm font-medium text-muted-foreground">Experience</span><div className="text-sm">{candidate.experience || '-'}</div></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Administrative */}
                <Card>
                    <CardHeader><CardTitle>Administrative Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-sm font-medium text-muted-foreground">GS Section</span><div className="text-sm">{candidate.gs_section || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">Police Area</span><div className="text-sm">{candidate.police_area || '-'}</div></div>
                            <div><span className="text-sm font-medium text-muted-foreground">AGA Division</span><div className="text-sm">{candidate.aga_division || '-'}</div></div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Assigned Agent</span>
                                <div className="mt-1">
                                    <AgentAssignment
                                        candidateId={candidate.id}
                                        currentAgentId={candidate.agent_id}
                                        agents={agents}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-t pt-4 mt-2">
                            <div><span className="text-sm font-medium text-muted-foreground">Remarks</span><div className="text-sm whitespace-pre-wrap">{candidate.remarks || '-'}</div></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
