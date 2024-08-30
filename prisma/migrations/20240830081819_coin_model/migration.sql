-- CreateTable
CREATE TABLE "Coin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mintAmount" INTEGER NOT NULL,
    "mint" TEXT[],
    "mintAuth" TEXT[],
    "freezeAuth" TEXT[],
    "tokenAccount" TEXT[],
    "createdBy" TEXT NOT NULL,
    "subscriberCount" INTEGER NOT NULL,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);
