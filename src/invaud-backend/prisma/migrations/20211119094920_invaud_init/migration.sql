-- CreateTable
CREATE TABLE `InvoiceOverview` (
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('Proforma', 'Adaptation', 'Posted', 'Reconciled', 'Released', 'Settled', 'Exception') NOT NULL,
    `originCode` VARCHAR(191) NOT NULL,
    `destinationCode` VARCHAR(191) NOT NULL,
    `shipmentDate` DATETIME(3) NOT NULL,
    `invoiceDate` DATETIME(3) NOT NULL,
    `billToParty` VARCHAR(191) NOT NULL,
    `shipper` VARCHAR(191) NOT NULL,
    `consignee` VARCHAR(191) NOT NULL,
    `totalValueOfGoods` DOUBLE NOT NULL,
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `lockedBy` VARCHAR(191),

    PRIMARY KEY (`invoiceNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('Proforma', 'Adaptation', 'Posted', 'Reconciled', 'Released', 'Settled', 'Exception') NOT NULL,
    `selfBilled` BOOLEAN NOT NULL,
    `invoiceDate` DATETIME(3) NOT NULL,
    `invoiceCurrency` VARCHAR(191),
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `lockedBy` VARCHAR(191),
    `shipReferenceId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Invoice.shipReferenceId_unique`(`shipReferenceId`),
    PRIMARY KEY (`invoiceNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipment` (
    `shipReferenceId` VARCHAR(191) NOT NULL,
    `trackingNumber` VARCHAR(191) NOT NULL,
    `modeOfTransport` VARCHAR(191) NOT NULL,
    `shipmentDate` DATETIME(3) NOT NULL,
    `numberOfPieces` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `weightUom` VARCHAR(191) NOT NULL,
    `chargeableWeight` DOUBLE NOT NULL,
    `chargeableWeightUom` VARCHAR(191) NOT NULL,
    `volume` DOUBLE NOT NULL,
    `volumeUom` VARCHAR(191) NOT NULL,
    `freightTerms` VARCHAR(191) NOT NULL,
    `otherChargesTerms` VARCHAR(191) NOT NULL,
    `shipmentIncoTerms` VARCHAR(191) NOT NULL,
    `shipmentServiceCode` VARCHAR(191) NOT NULL,
    `valueOfGoods` DOUBLE NOT NULL,
    `goodsValuta` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Shipment.invoiceNumber_unique`(`invoiceNumber`),
    PRIMARY KEY (`shipReferenceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Station` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('origin', 'destination') NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `shipReferenceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('shipper', 'consignee', 'billToParty') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `addressLine2` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `countryName` VARCHAR(191) NOT NULL,
    `taxId` VARCHAR(191),
    `shipperInvoiceNumber` VARCHAR(191),
    `consigneeInvoiceNumber` VARCHAR(191),
    `billToPartyInvoiceNumber` VARCHAR(191),

    UNIQUE INDEX `Address.shipperInvoiceNumber_unique`(`shipperInvoiceNumber`),
    UNIQUE INDEX `Address.consigneeInvoiceNumber_unique`(`consigneeInvoiceNumber`),
    UNIQUE INDEX `Address.billToPartyInvoiceNumber_unique`(`billToPartyInvoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChainEvent` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reference` (
    `id` VARCHAR(191) NOT NULL,
    `qualifier` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChargeLine` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `additionalCharge` BOOLEAN NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected'),
    `invoiceNumber` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdditionalDocument` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdDate` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('shipper', 'forwarder', 'fba', 'admin', 'super_admin') NOT NULL,
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `failedLoginAttempts` INTEGER NOT NULL DEFAULT 0,
    `passwordChangeRequired` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `archivedAt` DATETIME(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `token` VARCHAR(500) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RefreshToken.userId_unique`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice` ADD FOREIGN KEY (`shipReferenceId`) REFERENCES `Shipment`(`shipReferenceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Station` ADD FOREIGN KEY (`shipReferenceId`) REFERENCES `Shipment`(`shipReferenceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD FOREIGN KEY (`shipperInvoiceNumber`) REFERENCES `Invoice`(`invoiceNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD FOREIGN KEY (`consigneeInvoiceNumber`) REFERENCES `Invoice`(`invoiceNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD FOREIGN KEY (`billToPartyInvoiceNumber`) REFERENCES `Invoice`(`invoiceNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChainEvent` ADD FOREIGN KEY (`invoiceNumber`) REFERENCES `Invoice`(`invoiceNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reference` ADD FOREIGN KEY (`invoiceNumber`) REFERENCES `Invoice`(`invoiceNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChargeLine` ADD FOREIGN KEY (`invoiceNumber`) REFERENCES `Invoice`(`invoiceNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdditionalDocument` ADD FOREIGN KEY (`invoiceNumber`) REFERENCES `Invoice`(`invoiceNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
