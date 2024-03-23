-- AlterTable
ALTER TABLE "services" ADD COLUMN     "interval" INTEGER,
ADD COLUMN     "is_subscription" BOOLEAN DEFAULT false,
ADD COLUMN     "sessions" INTEGER;
