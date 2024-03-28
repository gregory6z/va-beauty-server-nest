/*
  Warnings:

  - Made the column `is_subscription` on table `appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "is_subscription" SET NOT NULL;
