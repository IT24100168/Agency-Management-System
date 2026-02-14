
'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { candidateFormSchema } from './schema'

export async function createCandidate(formData: FormData) {

    // Helper to get string or undefined
    const get = (key: string) => {
        const val = formData.get(key)
        return (val && val !== '') ? val as string : undefined
    }

    const rawData = {
        full_name: get('full_name'),
        registration_number: get('registration_number'),
        registration_date: get('registration_date'),
        name_with_initials: get('name_with_initials'),
        nic: get('nic'),
        dob: get('dob'),
        age: get('age'), // Will be coerced by Zod
        gender: get('gender'),
        photo: get('photo'), // URL from hidden input if pre-uploaded, OR handled below if file

        // Personal
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

        // Guardian
        guardian_name: get('guardian_name'),
        guardian_address: get('guardian_address'),
        guardian_relationship: get('guardian_relationship'),
        guardian_contact: get('guardian_contact'),

        // Passport
        passport_no: get('passport_no'),
        passport_issued_date: get('passport_issued_date'),
        passport_exp_date: get('passport_exp_date'),
        passport_place_issued: get('passport_place_issued'),
        passport_status: get('passport_status'),

        // Job
        job_country: get('job_country'),
        job_post: get('job_post'),
        job_salary: get('job_salary'),
        contract_period: get('contract_period'),
        experience: get('experience'),

        // Remarks
        remarks: get('remarks'),

        agent_id: get('agent_id'),
    }

    // Validate
    const validatedFields = candidateFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Candidate.',
        }
    }

    const data = validatedFields.data

    // Handle Photo Upload if file is present in formData
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
                        .resize(600, 600, { fit: 'cover' }) // Passport photo style
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
        await prisma.candidate.create({
            data: {
                fullName: data.full_name,
                registrationNumber: data.registration_number,
                registrationDate: data.registration_date ? new Date(data.registration_date) : new Date(),
                nameWithInitials: data.name_with_initials,
                nic: data.nic,
                dob: data.dob ? new Date(data.dob) : null,
                age: data.age,
                gender: data.gender,
                photo: photoPath || data.photo, // Use file upload path OR string url

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
                passportStatus: data.passport_status,

                jobCountry: data.job_country,
                jobPost: data.job_post,
                jobSalary: data.job_salary,
                contractPeriod: data.contract_period,
                experience: data.experience,

                remarks: data.remarks,

                agentId: data.agent_id,
                status: 'Registered',
                processing: {
                    create: {
                        type: 'Registered',
                        status: 'Completed',
                        completionDate: new Date()
                    }
                }
            }
        })
    } catch (error) {
        console.error("Prisma Insert Error:", error)
        return {
            message: 'Database Error: Failed to Create Candidate.',
            error: String(error)
        }
    }

    redirect('/dashboard/candidates')
}
