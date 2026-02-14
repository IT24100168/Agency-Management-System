
import { getCandidate } from "../../[id]/actions"
import { notFound } from "next/navigation"
import Image from "next/image"
import { PrintTrigger } from "./print-trigger"

export default async function PrintCandidatePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const candidate = await getCandidate(params.id)

    if (!candidate) {
        notFound()
    }

    return (
        <div className="bg-white text-black min-h-screen p-8 max-w-[210mm] mx-auto print:p-0 print:max-w-none">
            <PrintTrigger />

            {/* Header */}
            <div className="flex items-center gap-6 border-b-2 border-slate-800 pb-6 mb-8">
                <div className="w-24 h-24 relative shrink-0">
                    <img src="/logo.png" alt="Rightway Logo" className="object-contain w-full h-full" />
                </div>
                <div className="flex-1 text-center">
                    <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Rightway Foreign Employment Agencies</h1>
                    <p className="text-sm text-gray-600">No 224, Rambukkana Road, Madige, Galagedara, Sri Lanka</p>
                    <p className="text-sm text-gray-600">Tel: +94 75 820 1235 | Email: rightway.rec@gmail.com | Licence No: 3418</p>
                </div>
                <div className="w-24 h-24 relative shrink-0 opacity-0">
                    {/* Spacer for balance */}
                </div>
            </div>

            {/* Candidate Title */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold underline decoration-2 underline-offset-4">CANDIDATE PROFILE</h2>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-8">

                {/* Left Column: Photo & basic info */}
                <div className="col-span-1 space-y-6">
                    <div className="w-48 h-56 bg-gray-100 border-2 border-gray-300 mx-auto overflow-hidden relative">
                        {candidate.photo ? (
                            <img src={candidate.photo} alt="Candidate" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Photo</div>
                        )}
                    </div>

                    <div className="text-center space-y-2 border-2 border-slate-200 p-4 rounded-lg">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Registration No</p>
                            <p className="text-xl font-mono font-bold">{candidate.registration_number || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                            <p className="font-semibold">{candidate.status}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="col-span-2 space-y-6">

                    {/* Section: Personal */}
                    <section>
                        <h3 className="text-lg font-bold bg-slate-100 p-2 mb-3 border-l-4 border-slate-800 uppercase text-sm">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="col-span-2"><span className="font-semibold w-32 inline-block">Full Name:</span> {candidate.full_name}</div>
                            <div className="col-span-2"><span className="font-semibold w-32 inline-block">Name w/ Initials:</span> {candidate.name_with_initials || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Date of Birth:</span> {candidate.dob ? new Date(candidate.dob).toLocaleDateString() : "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Age:</span> {candidate.age || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Gender:</span> {candidate.gender || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Marital Status:</span> {candidate.marital_status || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Nationality:</span> {candidate.nationality || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Religion:</span> {candidate.religion || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">NIC:</span> {candidate.nic || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Contact:</span> {candidate.contact_number || "-"}</div>
                        </div>
                    </section>

                    {/* Section: Passport */}
                    <section>
                        <h3 className="text-lg font-bold bg-slate-100 p-2 mb-3 border-l-4 border-slate-800 uppercase text-sm">Passport Details</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div><span className="font-semibold w-32 inline-block">Passport No:</span> {candidate.passport_no}</div>
                            <div><span className="font-semibold w-32 inline-block">Issued Place:</span> {candidate.passport_place_issued || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Issued Date:</span> {candidate.passport_issued_date ? new Date(candidate.passport_issued_date).toLocaleDateString() : "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Expiry Date:</span> {candidate.passport_exp_date ? new Date(candidate.passport_exp_date).toLocaleDateString() : "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Status:</span> {candidate.passport_status || "-"}</div>
                        </div>
                    </section>

                    {/* Section: Job */}
                    <section>
                        <h3 className="text-lg font-bold bg-slate-100 p-2 mb-3 border-l-4 border-slate-800 uppercase text-sm">Job Application</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div><span className="font-semibold w-32 inline-block">Country:</span> {candidate.job_country || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Job Post:</span> {candidate.job_post || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Salary:</span> {candidate.job_salary || "-"}</div>
                            <div><span className="font-semibold w-32 inline-block">Contract:</span> {candidate.contract_period || "-"}</div>
                        </div>
                    </section>
                    {/* Section: Education & Remarks */}
                    <section>
                        <h3 className="text-lg font-bold bg-slate-100 p-2 mb-3 border-l-4 border-slate-800 uppercase text-sm">Education & Other Remarks</h3>
                        <div className="text-sm min-h-[100px] border p-2 rounded-md">
                            {candidate.remarks || "No additional remarks."}
                        </div>
                    </section>
                </div>
            </div>

            {/* Declaration */}
            <div className="mt-12 mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide">
                    I hereby confirm that the above details are true and correct to the best of my knowledge.
                </p>
            </div>

            {/* Footer / Signature Area */}
            <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                    <div className="border-t border-black w-3/4 mx-auto pt-2">Candidate Signature</div>
                </div>
                <div>
                    <div className="border-t border-black w-3/4 mx-auto pt-2">Authorized Officer</div>
                </div>
                <div>
                    <div className="border-t border-black w-3/4 mx-auto pt-2">Date</div>
                </div>
            </div>
        </div>
    )
}
