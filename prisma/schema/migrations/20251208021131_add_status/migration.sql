/*
  Warnings:

  - The `status` column on the `host_applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "host_applications" DROP COLUMN "status",
ADD COLUMN     "status" "hostsStatus" NOT NULL DEFAULT 'PENDING';
