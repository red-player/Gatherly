/*
  Warnings:

  - Added the required column `serialNo` to the `userEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userEvent` ADD COLUMN `serialNo` INTEGER NOT NULL;
