-- CreateTable
CREATE TABLE `fileMetaData` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `fileSize` INTEGER NULL,
    `fileType` VARCHAR(50) NULL,
    `filePath` VARCHAR(500) NULL,
    `fileExtension` VARCHAR(8) NULL,
    `createdBy` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastModifiedBy` INTEGER NULL,
    `lastModified` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` TINYINT NOT NULL DEFAULT 0,
    `fileName` VARCHAR(250) NULL,
    `orgFileName` VARCHAR(250) NULL,

    UNIQUE INDEX `fileMetaData_pk2`(`id`),
    INDEX `fileMetaData_user_id_fk`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fileMetaData` ADD CONSTRAINT `fileMetaData_user_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
