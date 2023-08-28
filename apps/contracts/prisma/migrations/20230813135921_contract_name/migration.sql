/*
  Warnings:

  - Added the required column `contractName` to the `Deploy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deploy" ADD COLUMN     "contractArguments" TEXT[],
ADD COLUMN     "contractName" TEXT NOT NULL;
