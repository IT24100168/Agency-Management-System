
'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { candidateFormSchema } from '../../register/schema'
import { revalidatePath } from 'next/cache'

export async function updateCandidate(id: string, formData: FormData) {

    // Helper ...
    const get = (key: string) => {
        const val = formData.get(key)
        return (val && val !== '') ? val as string : undefined
    }

    const rawData = {
        full_name: get('full_name'),
        registration_number: get('registration_number'),
        name_with_initials: get('name_with_initials'),
        nic: get('nic'),
        dob: get('dob'),
        age: get('age'),
        gender: get('gender'),
        photo: get('photo'),

        home_town: get('home_town'),
        place_of_birth: get('place_of_birth'),
        gs_section: get('gs_section'),
        police_area: get('police_area'),
        aga_division: get('aga_division'),
        nationality: get('nationality'),
        religion: get('religion'),
        marital_status: get('marital_status'),
        contact_number: get('contact_number'),
        secondary_contact_number: get('secondary_contact_number'),
        address: get('address'),
        weight: get('weight'),
        height: get('height'),
        children_count: get('children_count'),

        guardian_name: get('guardian_name'),
        guardian_address: get('guardian_address'),
        guardian_relationship: get('guardian_relationship'),
        guardian_contact: get('guardian_contact'),

        passport_no: get('passport_no'),
        passport_issued_date: get('passport_issued_date'),
        passport_exp_date: get('passport_exp_date'),
        passport_place_issued: get('passport_place_issued'),

        job_country: get('job_country'),
        job_post: get('job_post'),
        job_salary: get('job_salary'),
        contract_period: get('contract_period'),
        experience: get('experience'),

        remarks: get('remarks'),

        agent_id: get('agent_id'),
    }

    const validatedFields = candidateFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Candidate.',
        }
    }

    const data = validatedFields.data

    // Handle Photo Upload
    const photoFile = formData.get('photo_file') as File
    let photoPath = undefined

    if (photoFile && photoFile.size > 0 && photoFile.name !== 'undefined') {
        try {
            const { writeFile, mkdir } = await import('fs/promises')
            const { join } = await import('path')

            const bytes = await photoFile.arrayBuffer()
            let buffer = Buffer.from(bytes)

            // Compress image
            if (photoFile.type.startsWith('image/')) {
                try {
                    const sharp = require('sharp');
                    buffer = await sharp(buffer)
                        .resize(600, 600, { fit: 'cover' })
                        .jpeg({ quality: 80 })
                        .toBuffer();
                } catch (e) {
                    console.error("Image compression failed:", e)
                }
            }

            const fileName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'photos')
            await mkdir(uploadDir, { recursive: true })
            await writeFile(join(uploadDir, fileName), buffer)
            photoPath = `/uploads/photos/${fileName}`
        } catch (error) {
            console.error("Photo upload failed:", error)
        }
    }

    try {
        await prisma.candidate.update({
            where: { id },
            data: {
                fullName: data.full_name,
                registrationNumber: data.registration_number,
                nameWithInitials: data.name_with_initials,
                nic: data.nic,
                dob: data.dob ? new Date(data.dob) : null,
                age: data.age,
                gender: data.gender,
                photo: photoPath || data.photo, // Update if new file, else keep existing (or update to same)

                homeTown: data.home_town,
                placeOfBirth: data.place_of_birth,
                gsSection: data.gs_section,
                policeArea: data.police_area,
                agaDivision: data.aga_division,
                nationality: data.nationality,
                religion: data.religion,
                maritalStatus: data.marital_status,
                contactNumber: data.contact_number,
                secondaryContactNumber: data.secondary_contact_number,
                address: data.address,
                weight: data.weight,
                height: data.height,
                childrenCount: data.children_count,

                guardianName: data.guardian_name,
                guardianAddress: data.guardian_address,
                guardianRelationship: data.guardian_relationship,
                guardianContact: data.guardian_contact,

                passportNo: data.passport_no,
                passportIssuedDate: data.passport_issued_date ? new Date(data.passport_issued_date) : null,
                passportExpDate: data.passport_exp_date ? new Date(data.passport_exp_date) : null,
                passportPlaceIssued: data.passport_place_issued,

                jobCountry: data.job_country,
                jobPost: data.job_post,
                jobSalary: data.job_salary,
                contractPeriod: data.contract_period,
                experience: data.experience,

                remarks: data.remarks,

                agentId: data.agent_id,
            }
        })

        revalidatePath('/dashboard/candidates')
        revalidatePath(`/dashboard/candidates/${id}`)

    } catch (error) {
        console.error("Prisma Update Error:", error)
        return {
            message: 'Database Error: Failed to Update Candidate.',
            error: String(error)
        }
    }

    redirect('/dashboard/candidates')
}
