/*
  Warnings:

  - Added the required column `date` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "img_url" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "appointment_id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
