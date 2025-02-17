/*
  Warnings:

  - Added the required column `isApproved` to the `sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sponsor` ADD COLUMN `isApproved` BOOLEAN NOT NULL;
