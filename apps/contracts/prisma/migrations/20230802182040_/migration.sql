-- CreateTable
CREATE TABLE "Contract" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "abiPath" TEXT NOT NULL,
    "bytecodePath" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deploy" (
    "id" UUID NOT NULL,
    "contractId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "walletId" UUID NOT NULL,
    "deployedAddress" TEXT NOT NULL,
    "deployedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "private" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Deploy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calling" (
    "deployId" UUID NOT NULL,
    "times" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Calling_pkey" PRIMARY KEY ("deployId")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "owner" UUID NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("owner")
);

-- AddForeignKey
ALTER TABLE "Deploy" ADD CONSTRAINT "Deploy_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deploy" ADD CONSTRAINT "Deploy_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calling" ADD CONSTRAINT "Calling_deployId_fkey" FOREIGN KEY ("deployId") REFERENCES "Deploy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
