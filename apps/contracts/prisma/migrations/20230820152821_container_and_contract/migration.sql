/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the `Deploy` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `compiledPath` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containerId` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractName` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deployedAddress` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deploy" DROP CONSTRAINT "Deploy_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Deploy" DROP CONSTRAINT "Deploy_walletId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "createdAt",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "compiledPath" TEXT NOT NULL,
ADD COLUMN     "containerId" UUID NOT NULL,
ADD COLUMN     "contractArguments" TEXT[],
ADD COLUMN     "contractName" TEXT NOT NULL,
ADD COLUMN     "deployedAddress" TEXT NOT NULL,
ADD COLUMN     "deployedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "walletId" UUID NOT NULL;

-- DropTable
DROP TABLE "Deploy";

-- CreateTable
CREATE TABLE "Container" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
