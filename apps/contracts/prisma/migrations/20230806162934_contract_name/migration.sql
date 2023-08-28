-- CreateTable
CREATE TABLE "ContractName" (
    "contractId" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ContractName_pkey" PRIMARY KEY ("contractId","name")
);

-- AddForeignKey
ALTER TABLE "ContractName" ADD CONSTRAINT "ContractName_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
