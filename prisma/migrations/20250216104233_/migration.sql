/*
  Warnings:

  - A unique constraint covering the columns `[ticketId]` on the table `userEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `userEvent_ticketId_key` ON `userEvent`(`ticketId`);
