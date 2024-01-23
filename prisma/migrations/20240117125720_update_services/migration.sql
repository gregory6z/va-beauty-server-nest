/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_appointment_id_fkey";

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "appointment_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
