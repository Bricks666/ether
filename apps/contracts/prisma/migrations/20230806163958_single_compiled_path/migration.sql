/*
  Warnings:

  - You are about to drop the column `abiPath` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `bytecodePath` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `compiledPath` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "abiPath",
DROP COLUMN "bytecodePath",
ADD COLUMN     "compiledPath" TEXT NOT NULL;
