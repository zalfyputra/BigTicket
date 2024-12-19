-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('Admin', 'Frontend', 'Backend', 'UIUX', 'DevOps', 'DataScientist', 'DataAnalyst', 'ITSupport', 'ProductManager', 'ProjectManager', 'User') NOT NULL DEFAULT 'User',
    `fullname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profile_url` VARCHAR(191) NOT NULL DEFAULT 'https://tl.vhv.rs/dpng/s/541-5413387_log-in-sign-up-micro-environment-diagram-hd.png',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('Backlog', 'OnProgress', 'Resolved') NOT NULL DEFAULT 'Backlog',
    `priority_status` ENUM('High', 'Normal') NOT NULL DEFAULT 'Normal',
    `request_ticket` VARCHAR(191) NOT NULL,
    `due_date` VARCHAR(191) NOT NULL,
    `role_pic` VARCHAR(191) NOT NULL,
    `product_status` VARCHAR(191) NOT NULL,
    `ticket_body` TEXT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Replies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reply_body` TEXT NOT NULL,
    `ticket_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Replies` ADD CONSTRAINT `Replies_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `Tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Replies` ADD CONSTRAINT `Replies_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
