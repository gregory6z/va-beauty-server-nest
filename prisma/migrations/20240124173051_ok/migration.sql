/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_clientId_fkey";

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "userEmail" TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey";

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
