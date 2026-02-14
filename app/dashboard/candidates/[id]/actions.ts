
'use server'

import { prisma } from '@/lib/prisma'
import { Candidate } from '@/types/candidate'

export async function getCandidate(id: string) {
    try {
        const candidate = await prisma.candidate.findUnique({
            where: { id },

            include: { processing: true }
        })

        if (!candidate) return null

        // Map to frontend type
        // Map to frontend type
        const mappedCandidate: Candidate = {
            id: candidate.id,
            // General
            registration_number: candidate.registrationNumber || undefined,
            full_name: candidate.fullName,
            name_with_initials: candidate.nameWithInitials || undefined,
            nic: candidate.nic || undefined,
            dob: candidate.dob ? candidate.dob.toISOString() : undefined,
            age: candidate.age || undefined,
            gender: candidate.gender || undefined,
            photo: candidate.photo || undefined, // URL

            // Personal
            home_town: candidate.homeTown || undefined,
            place_of_birth: candidate.placeOfBirth || undefined,
            gs_section: candidate.gsSection || undefined,
            police_area: candidate.policeArea || undefined,
            aga_division: candidate.agaDivision || undefined,
            nationality: candidate.nationality || undefined,
            religion: candidate.religion || undefined,
            marital_status: candidate.maritalStatus || undefined,
            contact_number: candidate.contactNumber || undefined,
            secondary_contact_number: candidate.secondaryContactNumber || undefined,
            address: candidate.address || undefined,

            // Decimals need conversion
            weight: candidate.weight ? Number(candidate.weight) : undefined,
            height: candidate.height ? Number(candidate.height) : undefined,
            children_count: candidate.childrenCount || undefined,

            // Guardian
            guardian_name: candidate.guardianName || undefined,
            guardian_address: candidate.guardianAddress || undefined,
            guardian_relationship: candidate.guardianRelationship || undefined,
            guardian_contact: candidate.guardianContact || undefined,

            // Passport
            passport_no: candidate.passportNo,
            passport_issued_date: candidate.passportIssuedDate ? candidate.passportIssuedDate.toISOString() : undefined,
            passport_exp_date: candidate.passportExpDate ? candidate.passportExpDate.toISOString() : undefined,
            passport_place_issued: candidate.passportPlaceIssued || undefined,
            passport_status: candidate.passportStatus || undefined,

            // Job
            job_country: candidate.jobCountry || undefined,
            job_post: candidate.jobPost || undefined,
            job_salary: candidate.jobSalary ? Number(candidate.jobSalary) : undefined,
            contract_period: candidate.contractPeriod || undefined,
            experience: candidate.experience || undefined,

            // Remarks
            remarks: candidate.remarks || undefined,


            status: candidate.status as any,
            processing_steps: candidate.processing.map(step => ({
                id: step.id,
                type: step.type,
                status: step.status,
                notes: step.notes,
                completion_date: step.completionDate ? step.completionDate.toISOString() : undefined
            })),
            agent_id: candidate.agentId || undefined,
            created_at: candidate.createdAt.toISOString()
        }

        return mappedCandidate
    } catch (error) {
        console.error('Error fetching candidate:', error)
        return null
    }
}
