/*
  Warnings:

  - You are about to drop the column `userEmail` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_userEmail_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "userEmail";

-- DropTable
DROP TABLE "users";
