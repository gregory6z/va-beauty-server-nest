/*
  Warnings:

  - A unique constraint covering the columns `[stripeId]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "services_stripeId_key" ON "services"("stripeId");
