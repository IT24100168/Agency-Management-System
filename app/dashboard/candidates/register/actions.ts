
'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { candidateFormSchema } from './schema'
import { invalidateCache } from '@/lib/cache'

export async function createCandidate(formData: FormData) {

    // Helper to get string or undefined
    const get = (key: string) => {
        const val = formData.get(key)
        return (val && val !== '') ? val as string : undefined
    }

    // Resolve "Other" fields — use the _other text if the main field is "Other"
    const resolveOther = (main: string | undefined, other: string | undefined) =>
        main === 'Other' ? (other || undefined) : main

    const rawData = {
        full_name: get('full_name'),
        registration_number: get('registration_number'),
        registration_date: get('registration_date'),
        name_with_initials: get('name_with_initials'),
        nic: get('nic'),
        dob: get('dob'),
        age: get('age'),
        gender: get('gender'),
        photo: get('photo'),

        // Personal
        home_town: get('home_town'),
        place_of_birth: get('place_of_birth'),
        address: get('address'),
        district: get('district'),
        province: get('province'),
        nationality: get('nationality'),
        religion: get('religion'),
        religion_other: get('religion_other'),
        marital_status: get('marital_status'),
        contact_number: get('contact_number'),
        secondary_contact_number: get('secondary_contact_number'),
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
        passport_type: get('passport_type'),

        // Job
        job_country: get('job_country'),
        job_category: get('job_category'),
        job_category_other: get('job_category_other'),
        job_post: get('job_post'),
        job_salary: get('job_salary'),
        contract_period: get('contract_period'),
        experience: get('experience'),

        // Education & Language
        education_level: get('education_level'),
        education_other: get('education_other'),
        english_proficiency: get('english_proficiency'),

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

    // Resolve "Other" values before writing to DB
    const resolvedReligion = resolveOther(data.religion, data.religion_other)
    const resolvedJobCategory = resolveOther(data.job_category, data.job_category_other)
    const resolvedEducation = resolveOther(data.education_level, data.education_other)
    const resolvedJobCountry = data.job_country

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
                photo: photoPath || data.photo,

                homeTown: data.home_town,
                placeOfBirth: data.place_of_birth,
                address: data.address,
                district: data.district,
                province: data.province,
                nationality: data.nationality,
                religion: resolvedReligion,
                maritalStatus: data.marital_status,
                contactNumber: data.contact_number,
                secondaryContactNumber: data.secondary_contact_number,
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
                passportType: data.passport_type,

                jobCountry: resolvedJobCountry,
                jobCategory: resolvedJobCategory,
                jobPost: data.job_post,
                jobSalary: data.job_salary,
                contractPeriod: data.contract_period,
                experience: data.experience,

                educationLevel: resolvedEducation,
                educationOther: data.education_level !== 'Other' ? undefined : data.education_other,
                englishProficiency: data.english_proficiency,

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

    invalidateCache('dashboard')
    invalidateCache('candidates')
    redirect('/dashboard/candidates')
}
