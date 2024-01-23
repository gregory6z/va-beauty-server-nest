/*
  Warnings:

  - You are about to drop the column `appointment_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `appointment_id` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `services` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_appointment_id_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "appointment_id",
DROP COLUMN "created_at",
DROP COLUMN "date",
DROP COLUMN "updated_at",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "servicesIds" TEXT[];

-- AlterTable
ALTER TABLE "services" DROP COLUMN "appointment_id",
DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
