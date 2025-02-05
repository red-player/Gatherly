/*
  Warnings:

  - You are about to drop the column `token` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserSession` DROP COLUMN `token`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `accessToken` TEXT NULL,
    ADD COLUMN `deviceId` VARCHAR(191) NULL,
    ADD COLUMN `idToken` TEXT NULL,
    ADD COLUMN `refreshToken` TEXT NULL,
    ADD COLUMN `revokedAt` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
