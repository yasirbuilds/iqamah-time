-- CreateEnum
CREATE TYPE "public"."PrayerName" AS ENUM ('FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA');

-- CreateEnum
CREATE TYPE "public"."PrayerType" AS ENUM ('JAMMAT', 'ALONE', 'QAZAH', 'MISSED');

-- CreateTable
CREATE TABLE "public"."Prayer" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "prayerName" "public"."PrayerName" NOT NULL,
    "prayerType" "public"."PrayerType" NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prayer_userId_prayerName_date_key" ON "public"."Prayer"("userId", "prayerName", "date");

-- AddForeignKey
ALTER TABLE "public"."Prayer" ADD CONSTRAINT "Prayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
