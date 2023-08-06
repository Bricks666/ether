/*
  Warnings:

  - You are about to drop the column `compiledPath` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the `Calling` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContractName` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `compiledPath` to the `Deploy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Calling" DROP CONSTRAINT "Calling_deployId_fkey";

-- DropForeignKey
ALTER TABLE "ContractName" DROP CONSTRAINT "ContractName_contractId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "compiledPath";

-- AlterTable
ALTER TABLE "Deploy" ADD COLUMN     "compiledPath" TEXT NOT NULL;

-- DropTable
DROP TABLE "Calling";

-- DropTable
DROP TABLE "ContractName";
