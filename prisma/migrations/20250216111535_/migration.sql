/*
  Warnings:

  - You are about to drop the column `eventCategoryId` on the `event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `event_eventCategoryId_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `eventCategoryId`;

-- CreateTable
CREATE TABLE `eventMapCategory` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `eventCategoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `eventMapCategory` ADD CONSTRAINT `eventMapCategory_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventMapCategory` ADD CONSTRAINT `eventMapCategory_eventCategoryId_fkey` FOREIGN KEY (`eventCategoryId`) REFERENCES `eventCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
