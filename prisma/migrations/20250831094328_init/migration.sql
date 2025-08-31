-- CreateEnum
CREATE TYPE "public"."SessionStatus" AS ENUM ('CREATED', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "public"."Photo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "naturalWidth" INTEGER,
    "naturalHeight" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "boxX" DOUBLE PRECISION NOT NULL,
    "boxY" DOUBLE PRECISION NOT NULL,
    "boxW" DOUBLE PRECISION NOT NULL,
    "boxH" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameSession" (
    "id" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" "public"."SessionStatus" NOT NULL DEFAULT 'CREATED',
    "foundCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guess" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "guessX" DOUBLE PRECISION NOT NULL,
    "guessY" DOUBLE PRECISION NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Score" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_photoId_name_key" ON "public"."Character"("photoId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Score_sessionId_key" ON "public"."Score"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."Character" ADD CONSTRAINT "Character_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "public"."Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameSession" ADD CONSTRAINT "GameSession_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "public"."Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Guess" ADD CONSTRAINT "Guess_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Guess" ADD CONSTRAINT "Guess_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Score" ADD CONSTRAINT "Score_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
