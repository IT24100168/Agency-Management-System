-- Create Users Table
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191),
    `role` VARCHAR(191) NOT NULL DEFAULT 'staff',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `users_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Agents Table
CREATE TABLE `agents` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191),
    `phone` VARCHAR(191),
    `address` VARCHAR(191),
    `contact_info` JSON,
    `user_id` VARCHAR(191),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `agents_user_id_key`(`user_id`),
    CONSTRAINT `agents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Candidates Table
CREATE TABLE `candidates` (
    `id` VARCHAR(191) NOT NULL,
    `registration_number` VARCHAR(191),
    `registration_date` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `full_name` VARCHAR(191) NOT NULL,
    `name_with_initials` VARCHAR(191),
    `nic` VARCHAR(191),
    `dob` DATETIME(3),
    `gender` VARCHAR(191),
    `age` INTEGER,
    `photo` VARCHAR(191),
    `home_town` VARCHAR(191),
    `place_of_birth` VARCHAR(191),
    `gs_section` VARCHAR(191),
    `police_area` VARCHAR(191),
    `aga_division` VARCHAR(191),
    `nationality` VARCHAR(191),
    `religion` VARCHAR(191),
    `marital_status` VARCHAR(191),
    `contact_number` VARCHAR(191),
    `secondary_contact_number` VARCHAR(191),
    `address` VARCHAR(191),
    `weight` DECIMAL(5, 2),
    `height` DECIMAL(5, 2),
    `children_count` INTEGER,
    `guardian_name` VARCHAR(191),
    `guardian_address` VARCHAR(191),
    `guardian_relationship` VARCHAR(191),
    `guardian_contact` VARCHAR(191),
    `passport_no` VARCHAR(191) NOT NULL,
    `passport_issued_date` DATETIME(3),
    `passport_exp_date` DATETIME(3),
    `passport_place_issued` VARCHAR(191),
    `passport_status` VARCHAR(191),
    `job_country` VARCHAR(191),
    `job_post` VARCHAR(191),
    `job_salary` DECIMAL(10, 2),
    `contract_period` VARCHAR(191),
    `experience` TEXT,
    `remarks` TEXT,
    `agent_id` VARCHAR(191),
    `status` VARCHAR(191) NOT NULL DEFAULT 'Registered',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `candidates_registration_number_key`(`registration_number`),
    UNIQUE INDEX `candidates_nic_key`(`nic`),
    UNIQUE INDEX `candidates_passport_no_key`(`passport_no`),
    CONSTRAINT `candidates_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Processing Table
CREATE TABLE `processing` (
    `id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `notes` TEXT,
    `completion_date` DATETIME(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    CONSTRAINT `processing_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Accounting Table
CREATE TABLE `accounting` (
    `id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191),
    `type` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(191),
    `created_by` VARCHAR(191),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    CONSTRAINT `accounting_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `accounting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Documents Table
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `candidate_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `file_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    CONSTRAINT `documents_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Reminders Table
CREATE TABLE `reminders` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    CONSTRAINT `reminders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert Admin User
INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `role`, `created_at`) VALUES
('admin-uuid', 'admin@example.com', '$2b$10$h5UuqLuZJCewSiQPMDHzQe0C0hbHZ1UHCDVDIsm0Xn4aZmtcamSNO', 'Admin User', 'admin', NOW());
